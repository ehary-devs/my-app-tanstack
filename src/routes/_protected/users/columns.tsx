import { type ColumnDef } from "@tanstack/react-table"
import { type User } from "@/types/users"

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.firstName}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    enableSorting: true,
  },
]
