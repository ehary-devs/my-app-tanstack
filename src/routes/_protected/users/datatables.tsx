import { useQuery } from '@tanstack/react-query'
import { apiFetchJson } from '@/lib/api/client'

export function DataTableUsers() {
  
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return apiFetchJson('/users')
    }
  })

  console.log(query.data)

  return (
    <div>
      <h1>Users</h1>
    </div>
  )
}
