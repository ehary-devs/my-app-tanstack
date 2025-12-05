import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/forgot')({
  component: RouteComponent,
  head: () => ({
    title: 'Forgot Password',
    meta: [
      {
        name: 'description',
        content: 'This is the forgot password page',
      },
    ],
  })
})

function RouteComponent() {
  return <div>Hello "/(auth)/forgot"!</div>
}
