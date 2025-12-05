import { createFileRoute } from '@tanstack/react-router'
import { AppAdmin } from '@/components/app-admin'
import { DataTableUsers } from './datatables'

const breadcrumb = [
  {
    title: 'Data Users Management',
    url: '/users',
  }
]

export const Route = createFileRoute('/_protected/users/')({
  component: () => (
    <AppAdmin breadcrumb={breadcrumb}>
      <RouteComponent />
    </AppAdmin>
  ),
  head: () => ({
    title: 'Users',
    meta: [
      {
        name: 'description',
        content: 'This is the users page',
      },
    ],
  })
})

function RouteComponent() {
  return <DataTableUsers />
}
