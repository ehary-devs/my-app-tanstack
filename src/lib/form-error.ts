import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

/**
 * Parse API error shape and map field-level errors into react-hook-form.
 * Returns a user-facing message if available, otherwise undefined.
 */
export function handleApiFormError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  defaultMessage: string
): string {
  let message = defaultMessage

  if (error instanceof Error) {
    message = error.message || defaultMessage
    try {
      const parsed = JSON.parse(error.message) as {
        message?: string
        errors?: { field?: string; errors?: string[] }[]
      }

      if (parsed?.message) {
        message = parsed.message
      }

      if (Array.isArray(parsed?.errors)) {
        parsed.errors.forEach(({ field, errors }) => {
          const fieldMessage = errors?.[0]
          if (field && fieldMessage) {
            setError(field as Path<T>, { type: "server", message: fieldMessage })
          }
        })
      }
    } catch {
      // ignore parse errors and keep fallback message
    }
  }

  return message
}

