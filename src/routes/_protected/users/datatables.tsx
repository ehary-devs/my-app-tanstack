import { DataTable } from '@/components/datatables/data-table'
import { userColumns } from './columns'

export function DataTableUsers() {
  

  return (
    <DataTable columns={userColumns} data={[]} />
  )
}
