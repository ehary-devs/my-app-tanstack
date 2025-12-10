import { useState } from "react"
import type { Permission } from "@/types"
import type { ColumnConfig } from "@/components/ui/data-table/create-column"
import { Badge } from "@/components/ui/badge"
import { ActionTable, type ActionItem } from "@/components/ui/data-table/action-table"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { apiFetchJson } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditPermissionDialogContent } from "./edit-modal"

export const tableColumns: ColumnConfig<Permission>[] = [
  {
    key: "name",
    label: "Nama",
    sortable: true,
    cell: (row) => row.name,
    cellClassName: "text-muted-foreground",
  },
  {
    key: "description",
    label: "Deskripsi",
    sortable: true,
    cell: (row) => row.description,
    cellClassName: "text-muted-foreground",
  },  
  {
    key: "isActive",
    label: "Status",
    sortable: true,
    align: "center",
    cell: (row) => (
      <Badge variant={row.isActive ? "default" : "destructive"}>
        {row.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Dibuat",
    sortable: true,
    cell: (row) =>
      row.createdAt
        ? new Date(row.createdAt).toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "",
    cellClassName: "text-muted-foreground",
  },
  {
    key: "Action",
    label: "Action",
    sortable: false,
    align: "center",
    cell: (row) => <ActionCell row={row} />,
  },
]

function ActionCell({ row }: { row: Permission }) {
  const queryClient = useQueryClient()
  const [openEdit, setOpenEdit] = useState(false)

  const actions: ActionItem<Permission>[] = [
    {
      label: "Edit",
      icon: Edit,
      withAlert: false,
      onClick: () => setOpenEdit(true),
    },
    {
      label: "Delete",
      icon: Trash2,
      withAlert: true,
      variant: "destructive",
      alertTitle: "Hapus Permission",
      alertDescription: `Apakah Anda yakin ingin menghapus permission "${row.name}"? Tindakan ini tidak dapat dibatalkan.`,
      alertConfirmText: "Hapus",
      alertCancelText: "Batal",
      onClick: async (permission) => {
        try {
          await apiFetchJson(`/permissions/${permission.uuid}`, {
            method: "DELETE",
          })
          toast.success(`Permission "${permission.name}" berhasil dihapus`)
          // Invalidate queries to refresh the table
          queryClient.invalidateQueries({ queryKey: ["permissions"] })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Gagal menghapus permission"
          toast.error(errorMessage)
        }
      },
    },
  ]

  return (
    <>
      <ActionTable row={row} actions={actions} />
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>Perbarui data permission.</DialogDescription>
          </DialogHeader>
          <EditPermissionDialogContent
            permission={row}
            onSuccess={() => setOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
