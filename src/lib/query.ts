// src/lib/query.ts

import { removeNulls } from "@/utils/object"

export function buildQuery(params: Record<string, any>) {
  const cleaned = removeNulls(params)

  const search = new URLSearchParams(
    Object.fromEntries(
      Object.entries(cleaned).map(([key, value]) => [
        key,
        String(value),
      ])
    )
  )

  return `?${search.toString()}`
}
