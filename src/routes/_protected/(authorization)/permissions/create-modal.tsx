import { useRef } from "react"
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { apiFetchJson } from "@/lib/api"
import { handleApiFormError } from "@/lib/form-error"
import type { ActionButton } from "@/components/ui/data-table/datatable"
import { Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export const permissionSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  isActive: z.boolean().default(true),
})

export type PermissionFormValues = z.infer<typeof permissionSchema>

export function CreatePermissionDialogContent({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  const closeRef = useRef<HTMLButtonElement>(null)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema) as Resolver<PermissionFormValues>,
    defaultValues: { name: "", description: "", isActive: true },
  })

  const onSubmit: SubmitHandler<PermissionFormValues> = async (values) => {
    try {
      await apiFetchJson("/permissions", {
        method: "POST",
        body: JSON.stringify(values),
      })
      await queryClient.invalidateQueries({ queryKey: ["permissions"] })
      toast.success(`Permission "${values.name}" berhasil dibuat`)
      reset()
      closeRef.current?.click()
      onSuccess?.()
    } catch (error) {
      toast.error(
        handleApiFormError<PermissionFormValues>(error, setError, "Gagal membuat permission")
      )
    }
  }

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
          defaultValue="true"
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
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  )
}

export function createPermissionDialogAction(): ActionButton {
  return {
    label: "Tambah Permission",
    variant: "default",
    icon: <Plus className="h-4 w-4" />,
    dialog: {
      title: "Permission Baru",
      description: "Isi form untuk membuat permission baru.",
      content: <CreatePermissionDialogContent />,
      contentClassName: "pb-2",
      footer: null, // blok fallback footer default (Tutup)
    },
  }
}

