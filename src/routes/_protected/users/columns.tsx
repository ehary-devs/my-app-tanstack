import type { User } from "@/types"
import type { ColumnConfig } from "@/components/ui/data-table/create-column"
import { Badge } from "@/components/ui/badge"
import { ActionTable, type ActionItem } from "@/components/ui/data-table/action-table"
import { Edit, Trash2 } from "lucide-react"
// import { useNavigate } from "@tanstack/react-router" // Uncomment when needed
import { toast } from "sonner"
import { apiFetchJson } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"

export const tableColumns: ColumnConfig<User>[] = [
  {
    key: "firstName",
    label: "Nama",
    sortable: true,
    cell: (row) => `${row.firstName} ${row.lastName}`,
    cellClassName: "text-muted-foreground",
  },
  {
    key: "username",
    label: "Username",
    sortable: true,
    cell: (row) => row.username,
    cellClassName: "text-muted-foreground",
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    cell: (row) => row.email,
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

function ActionCell({ row }: { row: User }) {
  // const navigate = useNavigate() // Uncomment when needed for navigation
  const queryClient = useQueryClient()

  const actions: ActionItem<User>[] = [
    {
      label: "Edit",
      icon: Edit,
      withAlert: false,
      onClick: (user) => {
        // Navigate to edit page or open edit modal
        // Example: navigate({ to: `/users/${user.uuid}/edit` })
        toast.info(`Edit user: ${user.firstName} ${user.lastName}`)
      },
    },
    {
      label: "Delete",
      icon: Trash2,
      withAlert: true,
      variant: "destructive",
      alertTitle: "Hapus User",
      alertDescription: `Apakah Anda yakin ingin menghapus user "${row.firstName} ${row.lastName}"? Tindakan ini tidak dapat dibatalkan.`,
      alertConfirmText: "Hapus",
      alertCancelText: "Batal",
      onClick: async (user) => {
        try {
          await apiFetchJson(`/users/${user.uuid}`, {
            method: "DELETE",
          })
          toast.success(`User "${user.firstName} ${user.lastName}" berhasil dihapus`)
          // Invalidate queries to refresh the table
          queryClient.invalidateQueries({ queryKey: ["users"] })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Gagal menghapus user"
          toast.error(errorMessage)
        }
      },
    },
  ]

  return <ActionTable row={row} actions={actions} />
}
