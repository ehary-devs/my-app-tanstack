// src/components/DataTable.tsx

import type { ReactNode } from "react"
import type {
  ColumnDef,
  VisibilityState,
} from "@tanstack/react-table"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Filter, Search, Columns, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export interface FilterOption {
  key: string
  label: string
  options: Array<{ value: string; label: string }>
}

export interface Filters {
  [key: string]: string[]
}

type ActionButtonBase = {
  label: string
  icon?: ReactNode
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
}

type LinkActionButton = ActionButtonBase & {
  to: string
  dialog?: never
}

type DialogActionButton = ActionButtonBase & {
  to?: never
  dialog: {
    title?: string
    description?: string
    content?: ReactNode
    footer?: ReactNode
    contentClassName?: string
  }
}

export type ActionButton = LinkActionButton | DialogActionButton

interface Props<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  page: number
  perPage: number
  setPage: (val: number) => void
  setPerPage: (val: number) => void
  totalPages: number

  // Search support
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string

  // Filter support - hanya untuk params backend
  filterOptions?: FilterOption[]
  filters?: Filters
  onFiltersChange?: (filters: Filters) => void

  // Custom action buttons
  actionButtons?: ActionButton[]
}

const isDialogAction = (action: ActionButton): action is DialogActionButton =>
  "dialog" in action && !!action.dialog

export function DataTable<T>({
  data,
  columns,
  page,
  perPage,
  setPage,
  setPerPage,
  totalPages,
  search = "",
  onSearchChange,
  searchPlaceholder = "Cari…",
  filterOptions = [],
  filters = {},
  onFiltersChange,
  actionButtons = [],
}: Props<T>) {
  // Column visibility state - internal di DataTable
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,

    // Semua state digabung
    state: {
      columnVisibility,
      pagination: {
        pageIndex: page - 1,
        pageSize: perPage,
      },
    },

    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  })

  // Handle filter change - hanya untuk params backend
  const handleFilterChange = (filterKey: string, value: string, checked: boolean) => {
    if (!onFiltersChange) return

    const currentValues = filters[filterKey] || []
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value)

    onFiltersChange({
      ...filters,
      [filterKey]: newValues,
    })
    setPage(1) // Reset to page 1 when filter changes
  }

  // Clear single filter
  const handleClearFilter = (filterKey: string) => {
    if (!onFiltersChange) return

    const newFilters = { ...filters }
    delete newFilters[filterKey]
    onFiltersChange(newFilters)
    setPage(1)
  }

  // Clear all filters
  const handleClearAllFilters = () => {
    if (!onFiltersChange) return

    onFiltersChange({})
    setPage(1)
  }

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some((values) => values.length > 0)

  // Handle search change
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value)
      setPage(1) // Reset to page 1 when search changes
    }
  }

  return (
    <div className="space-y-4">
      {/* TOOLBAR: Search, Filters, Column Visibility, Action Buttons */}
      {(actionButtons.length > 0 || onSearchChange || filterOptions.length > 0) && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {onSearchChange && (
              <div className="flex-1 sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
            {/* Filter Dropdowns */}
            {filterOptions.map((filterOption) => {
              const selectedValues = filters[filterOption.key] || []
              const hasSelection = selectedValues.length > 0

              return (
                <DropdownMenu key={filterOption.key}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9"
                    >
                      <Filter className="h-4 w-4 mr-1" />
                      {filterOption.label}
                      {hasSelection && (
                        <span className="ml-2 rounded-full bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
                          {selectedValues.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <DropdownMenuLabel className="p-0">{filterOption.label}</DropdownMenuLabel>
                      {hasSelection && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onPointerDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleClearFilter(filterOption.key)
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    {filterOption.options.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleFilterChange(filterOption.key, option.value, !!checked)
                        }
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
            
            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={handleClearAllFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            
            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Columns className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Toggle Column</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table.getAllLeafColumns().map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </div>
          {/* Action Buttons - Rata Kanan */}
          {actionButtons.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              {actionButtons.map((action, index) => {
                const icon = action.icon ?? <Plus className="h-4 w-4" />
                const variant = action.variant || "default"

                if (isDialogAction(action)) {
                  const { title, description, content, footer, contentClassName } = action.dialog
                  return (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <Button variant={variant} size="sm" className="h-9 gap-2">
                          {icon}
                          {action.label}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={contentClassName}>
                        {(title || description) && (
                          <DialogHeader>
                            {title && <DialogTitle>{title}</DialogTitle>}
                            {description && (
                              <DialogDescription>{description}</DialogDescription>
                            )}
                          </DialogHeader>
                        )}
                        {content}
                        {footer !== undefined ? (
                          <DialogFooter>{footer}</DialogFooter>
                        ) : (
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Tutup</Button>
                            </DialogClose>
                          </DialogFooter>
                        )}
                      </DialogContent>
                    </Dialog>
                  )
                }

                return (
                  <Button
                    key={index}
                    variant={variant}
                    size="sm"
                    className="h-9 gap-2"
                    asChild
                  >
                    <Link to={action.to}>
                      {icon}
                      {action.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      )}
      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header, index) => (
                  <TableHead 
                    key={header.id}
                    className={index < group.headers.length - 1 ? "border-r border-border" : ""}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell 
                      key={cell.id}
                      className={index < row.getVisibleCells().length - 1 ? "border-r border-border" : ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Baris per halaman</Label>
          <Select
            value={perPage.toString()}
            onValueChange={(value) => setPerPage(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((v) => (
                <SelectItem key={v} value={v.toString()}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
