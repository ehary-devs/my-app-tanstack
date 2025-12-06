import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface SortableHeaderProps {
  label: string
  columnKey: string
  orderBy: string
  orderDirection: "ASC" | "DESC"
  onSort: (columnKey: string, direction: "ASC" | "DESC") => void
}

export function SortableHeader({
  label,
  columnKey,
  orderBy,
  orderDirection,
  onSort,
}: SortableHeaderProps) {
  const isSorted = orderBy === columnKey
  const isAsc = isSorted && orderDirection === "ASC"
  const isDesc = isSorted && orderDirection === "DESC"

  const handleClick = () => {
    const newDirection = isSorted && orderDirection === "ASC" ? "DESC" : "ASC"
    onSort(columnKey, newDirection)
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="h-8 px-2 lg:px-3 hover:bg-transparent"
    >
      {label}
      <span className="ml-2">
        {!isSorted && (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        )}
        {isAsc && <ArrowUp className="h-4 w-4" />}
        {isDesc && <ArrowDown className="h-4 w-4" />}
      </span>
    </Button>
  )
}

