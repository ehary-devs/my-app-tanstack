import { Skeleton } from "@/components/ui/skeleton"
import { Loader2Icon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TableLoadingProps {
  title?: string
  showCard?: boolean
  columnCount?: number
  rowCount?: number
  showToolbar?: boolean
  showPagination?: boolean
}

export function TableLoading({
  title,
  showCard = true,
  columnCount = 5,
  rowCount = 5,
  showToolbar = true,
  showPagination = true,
}: TableLoadingProps) {
  const content = (
    <div className="space-y-4">
      {/* Toolbar Skeleton */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 sm:max-w-md">
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      )}

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <div className="border-b p-4">
          <div className="flex gap-4">
            {Array.from({ length: columnCount }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="border-b p-4 last:border-b-0">
            <div className="flex gap-4 items-center">
              {Array.from({ length: columnCount }).map((_, j) => (
                <Skeleton
                  key={j}
                  className={cn(
                    "flex-1",
                    j === 2 ? "h-6 w-16 rounded-full" : "h-4"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-[70px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-4">
        <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    </div>
  )

  if (showCard) {
    return (
      <div className="py-6 space-y-6">
        <Card className="shadow-none">
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent>{content}</CardContent>
        </Card>
      </div>
    )
  }

  return <div className="py-6 space-y-6">{content}</div>
}

