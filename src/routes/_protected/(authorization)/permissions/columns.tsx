import type { Permission } from "@/types"
import type { ColumnConfig } from "@/components/ui/data-table/create-column"
import { Badge } from "@/components/ui/badge"

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
    cell: () => "",
  },
]
