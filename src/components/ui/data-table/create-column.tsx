import type { ColumnDef } from "@tanstack/react-table"
import type React from "react"
import { SortableHeader } from "./sortable-header"

export interface ColumnConfig<T> {
  key: string
  label: string
  sortable?: boolean
  cell?: (row: T) => React.ReactNode
  cellClassName?: string
}

interface CreateColumnOptions {
  orderBy: string
  orderDirection: "ASC" | "DESC"
  onSort: (columnKey: string, direction: "ASC" | "DESC") => void
  numberColumn?: boolean
  page?: number
  perPage?: number
}

export function createColumn<T>(
  config: ColumnConfig<T>,
  options: CreateColumnOptions
): ColumnDef<T> {
  const { key, label, sortable = false, cell, cellClassName } = config
  const { orderBy, orderDirection, onSort } = options

  return {
    id: key,
    accessorKey: key,
    header: sortable
      ? () => (
          <SortableHeader
            label={label}
            columnKey={key}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onSort={onSort}
          />
        )
      : label,
    cell: cell
      ? ({ row }) => <div className={cellClassName}>{cell(row.original)}</div>
      : ({ row }) => (
          <div className={cellClassName}>{String(row.getValue(key) ?? "")}</div>
        ),
  }
}

function createNumberColumn<T>(
  page: number = 1,
  perPage: number = 10
): ColumnDef<T> {
  return {
    id: "no",
    header: () => <div className="px-4">No</div>,
    size: 70,
    minSize: 70,
    maxSize: 70,
    cell: ({ row }) => {
      const rowIndex = row.index
      const number = (page - 1) * perPage + rowIndex + 1
      return <div className="px-4">{number}</div>
    },
    enableSorting: false,
  }
}

export function createColumns<T>(
  configs: ColumnConfig<T>[],
  options: CreateColumnOptions
): ColumnDef<T>[] {
  const columns = configs.map((config) => createColumn(config, options))
  
  if (options.numberColumn) {
    const numberColumn = createNumberColumn<T>(
      options.page ?? 1,
      options.perPage ?? 10
    )
    return [numberColumn, ...columns]
  }
  
  return columns
}

