import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/403')({
  component: RouteComponent,
  head: () => ({
    title: '403 - Forbidden',
    meta: [
      {
        name: 'description',
        content: 'You do not have permission to access this page',
      },
    ],
  })
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">403</h1>
        <p className="text-muted-foreground mt-2">Forbidden</p>
        <p className="text-sm mt-4">You do not have permission to access this page.</p>
      </div>
    </div>
  )
}
