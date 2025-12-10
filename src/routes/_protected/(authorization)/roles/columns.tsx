import { useState } from "react"
import type { Role } from "@/types"
import type { ColumnConfig } from "@/components/ui/data-table/create-column"
import { Badge } from "@/components/ui/badge"
import { ActionTable, type ActionItem } from "@/components/ui/data-table/action-table"
import { Edit, Trash2, ShieldCheck } from "lucide-react"
// import { useNavigate } from "@tanstack/react-router" // Uncomment when needed
import { toast } from "sonner"
import { apiFetchJson } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditRoleDialogContent } from "./edit-modal"

export const tableColumns: ColumnConfig<Role>[] = [
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
    key: "permissionsCount",
    label: "Permissions",
    sortable: true,
    align: "center",
    cell: (row) => (
      <Button variant="outline" className="min-w-[150px] font-normal inline-flex items-center justify-start gap-1.5" asChild>
        <Link to="/roles/settings/$uuid" params={{ uuid: row.uuid }} className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Permissions : {row.permissionsCount}
        </Link>
      </Button>
    ),
  },
  {
    key: "Action",
    label: "Action",
    sortable: false,
    align: "center",
    cell: (row) => <ActionCell row={row} />,
  },
]

function ActionCell({ row }: { row: Role }) {
  // const navigate = useNavigate() // Uncomment when needed for navigation
  const queryClient = useQueryClient()
  const [openEdit, setOpenEdit] = useState(false)

  const actions: ActionItem<Role>[] = [
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
      alertTitle: "Hapus Role",
      alertDescription: `Apakah Anda yakin ingin menghapus role "${row.name}"? Tindakan ini tidak dapat dibatalkan.`,
      alertConfirmText: "Hapus",
      alertCancelText: "Batal",
      onClick: async (role) => {
        try {
          await apiFetchJson(`/roles/${role.uuid}`, {
            method: "DELETE",
          })
          toast.success(`Role "${role.name}" berhasil dihapus`)
          // Invalidate role queries to refresh the table
          queryClient.invalidateQueries({ queryKey: ["roles"] })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Gagal menghapus role"
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
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Perbarui data role.</DialogDescription>
          </DialogHeader>
          <EditRoleDialogContent
            role={row}
            onSuccess={() => setOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
