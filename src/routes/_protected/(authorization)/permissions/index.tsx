import { AppAdmin } from '@/components/app-admin'
import { hasPermission } from "@/helpers/auth"
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { apiFetchJson } from "@/lib/api"
import { buildQuery } from "@/lib/query"
import { DataTable } from "@/components/ui/data-table/datatable"
import { createColumns } from "@/components/ui/data-table/create-column"
import { tableColumns } from "./columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableLoading } from "@/components/ui/data-table/table-loading"
import type { FilterOption, Filters, ActionButton } from "@/components/ui/data-table/datatable"
import { createPermissionDialogAction } from "./create-modal"

const breadcrumb = [{ title: 'Data Permissions Management', url: '/permissions' }]

export const Route = createFileRoute('/_protected/(authorization)/permissions/')({
  beforeLoad: () => {
    if (!hasPermission("permission.read")) {
      throw redirect({ to: "/403" })
    }
  },
  component: () => (
    <AppAdmin breadcrumb={breadcrumb}>
      <RouteComponent />
    </AppAdmin>
  ),
  head: () => ({
    title: 'Permissions',
    meta: [{ name: 'description', content: 'This is the permissions page' }],
  })
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState("")
  const [orderBy, setOrderBy] = useState("name")
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("ASC")
  const [filters, setFilters] = useState<Filters>({})
  
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useQuery({
    queryKey: ["permissions", { page, perPage, search: debouncedSearch, orderBy, orderDirection, filters }],
    queryFn: async () => {
      const params = buildQuery({
        page,
        perPage,
        search: debouncedSearch,
        orderBy,
        orderDirection,
        ...(filters.status?.length && { status: filters.status.join(",") }),
      })
      const res = await apiFetchJson(`/permissions${params}`)
      return {
        items: res.data ?? [],
        totalPages: res.meta?.totalPages ?? 1,
      }
    },
    placeholderData: (prev) => prev,
  })

  const columns = useMemo(
    () => createColumns(tableColumns, {
      orderBy,
      orderDirection,
      onSort: (columnKey, direction) => {
        setOrderBy(columnKey)
        setOrderDirection(direction)
      },
      numberColumn: false,
      page,
      perPage,
    }),
    [orderBy, orderDirection, page, perPage]
  )

  if (isLoading && !data) return <TableLoading title="Data Permissions Management" />

  const filterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ]

  const actionButtons: ActionButton[] = [
    createPermissionDialogAction(),
  ]

  return (
    <div className="py-6 space-y-6">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Data Permissions Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data?.items ?? []}
            columns={columns}
            page={page}
            perPage={perPage}
            setPage={setPage}
            setPerPage={setPerPage}
            totalPages={data?.totalPages ?? 1}
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Cari permission…"
            filterOptions={filterOptions}
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters)
              setPage(1)
            }}
            actionButtons={actionButtons}
          />
        </CardContent>
      </Card>
    </div>
  )
}
