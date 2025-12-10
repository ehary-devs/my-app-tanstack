import { useEffect, useRef } from "react"
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { apiFetchJson } from "@/lib/api"
import { Label } from "@/components/ui/label"
import type { Role } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { handleApiFormError } from "@/lib/form-error"
import { roleSchema, type RoleFormValues } from "./create-modal"

export function EditRoleDialogContent({
  role,
  onSuccess,
}: {
  role: Role
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
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema) as Resolver<RoleFormValues>,
    defaultValues: {
      name: role.name,
      description: role.description,
      isActive: role.isActive ?? true,
    },
  })

  useEffect(() => {
    reset({
      name: role.name,
      description: role.description,
      isActive: role.isActive ?? true,
    })
  }, [role, reset])

  const onSubmit: SubmitHandler<RoleFormValues> = async (values) => {
    try {
      await apiFetchJson(`/roles/${role.uuid}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      })
      await queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success(`Role "${values.name}" berhasil diperbarui`)
      closeRef.current?.click()
      onSuccess?.()
    } catch (error) {
      toast.error(handleApiFormError<RoleFormValues>(error, setError, "Gagal memperbarui role"))
    }
  }

  const isActiveValue = watch("isActive") ? "true" : "false"

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Nama <span className="text-destructive">*</span>
        </Label>
        <Input {...register("name")} placeholder="example: ADMIN" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Deskripsi <span className="text-destructive">*</span>
        </Label>
        <Input {...register("description")} placeholder="Masukkan deskripsi role" />
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

