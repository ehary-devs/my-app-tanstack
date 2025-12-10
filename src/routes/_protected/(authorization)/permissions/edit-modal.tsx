import { useEffect, useRef } from "react"
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { apiFetchJson } from "@/lib/api"
import { handleApiFormError } from "@/lib/form-error"
import { Label } from "@/components/ui/label"
import type { Permission } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { permissionSchema, type PermissionFormValues } from "./create-modal"

export function EditPermissionDialogContent({
  permission,
  onSuccess,
}: {
  permission: Permission
  onSuccess?: () => void
}) {
  const queryClient = useQueryClient()
  const closeRef = useRef<HTMLButtonElement>(null)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema) as Resolver<PermissionFormValues>,
    defaultValues: {
      name: permission.name,
      description: permission.description,
      isActive: permission.isActive ?? true,
    },
  })

  useEffect(() => {
    reset({
      name: permission.name,
      description: permission.description,
      isActive: permission.isActive ?? true,
    })
  }, [permission, reset])

  const onSubmit: SubmitHandler<PermissionFormValues> = async (values) => {
    try {
      await apiFetchJson(`/permissions/${permission.uuid}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      })
      await queryClient.invalidateQueries({ queryKey: ["permissions"] })
      toast.success(`Permission "${values.name}" berhasil diperbarui`)
      closeRef.current?.click()
      onSuccess?.()
    } catch (error) {
      toast.error(
        handleApiFormError<PermissionFormValues>(error, setError, "Gagal memperbarui permission")
      )
    }
  }

  const isActiveValue = watch("isActive") ? "true" : "false"

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Nama <span className="text-destructive">*</span>
        </Label>
        <Input {...register("name")} placeholder="example: permission.create" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Deskripsi <span className="text-destructive">*</span>
        </Label>
        <Input {...register("description")} placeholder="Masukkan deskripsi permission" />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Status</Label>
        <Select
          value={isActiveValue}
          onValueChange={(val) => {
            setValue("isActive", val === "true", { shouldDirty: true })
          }}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {errors.isActive && <p className="text-sm text-destructive">{errors.isActive.message}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline" type="button" ref={closeRef}>
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Memperbarui..." : "Perbarui"}
        </Button>
      </div>
    </form>
  )
}

