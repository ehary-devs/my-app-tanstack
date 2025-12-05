import { useState } from "react"
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef
  } from "@tanstack/react-table"
  
  import { DataTableToolbar } from "./data-table-toolbar"
  import { DataTablePagination } from "./data-table-pagination"
  
  interface DataTableProps<TData> {
    columns: ColumnDef<TData>[]
    data: TData[]
  }
  
  export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
    const [globalFilter, setGlobalFilter] = useState("")
    
    const table = useReactTable({
      data,
      columns,
      state: {
        sorting: [],
        globalFilter,
      },
      onGlobalFilterChange: setGlobalFilter,
  
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    })
  
    return (
      <div className="space-y-4">
        <DataTableToolbar
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
  
        <table className="w-full border">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
  
                      {header.column.getIsSorted() === "asc" && "↑"}
                      {header.column.getIsSorted() === "desc" && "↓"}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
  
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
  
        <DataTablePagination table={table} />
      </div>
    )
  }
  