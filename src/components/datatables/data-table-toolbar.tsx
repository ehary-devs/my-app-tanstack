import { Input } from "@/components/ui/input"

interface DataTableToolbarProps {
  globalFilter: string | undefined
  setGlobalFilter: (value: string) => void
}

export function DataTableToolbar({ globalFilter, setGlobalFilter }: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <Input
        placeholder="Search..."
        className="w-60"
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  )
}
