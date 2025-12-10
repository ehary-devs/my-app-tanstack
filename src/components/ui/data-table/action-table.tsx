import * as React from "react"
import { MoreHorizontal, type LucideIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ActionItem<T = any> {
  label: string
  icon?: LucideIcon
  onClick: (row: T) => void | Promise<void>
  withAlert?: boolean
  alertTitle?: string
  alertDescription?: string
  alertConfirmText?: string
  alertCancelText?: string
  variant?: "default" | "destructive"
  disabled?: boolean | ((row: T) => boolean)
}

interface ActionTableProps<T = any> {
  row: T
  actions: ActionItem<T>[]
  className?: string
}

export function ActionTable<T = any>({
  row,
  actions,
  className,
}: ActionTableProps<T>) {
  const [openDialog, setOpenDialog] = React.useState<string | null>(null)
  const [selectedAction, setSelectedAction] = React.useState<ActionItem<T> | null>(null)

  const handleActionClick = (action: ActionItem<T>) => {
    if (action.disabled) {
      const isDisabled = typeof action.disabled === "function" 
        ? action.disabled(row) 
        : action.disabled
      if (isDisabled) return
    }

    if (action.withAlert) {
      setSelectedAction(action)
      setOpenDialog(action.label)
    } else {
      action.onClick(row)
    }
  }

  const handleConfirm = async () => {
    if (selectedAction) {
      await selectedAction.onClick(row)
      setOpenDialog(null)
      setSelectedAction(null)
    }
  }

  const handleCancel = () => {
    setOpenDialog(null)
    setSelectedAction(null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn("h-8 w-8", className)}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => {
            const isDisabled = typeof action.disabled === "function" 
              ? action.disabled(row) 
              : action.disabled ?? false

            const Icon = action.icon

            return (
              <DropdownMenuItem
                key={index}
                variant={action.variant}
                disabled={isDisabled}
                onClick={() => handleActionClick(action)}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedAction && (
        <AlertDialog open={openDialog === selectedAction.label} onOpenChange={(open) => !open && handleCancel()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedAction.alertTitle || "Konfirmasi"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedAction.alertDescription || "Apakah Anda yakin ingin melanjutkan?"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {selectedAction.alertCancelText || "Batal"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className={cn(
                  selectedAction.variant === "destructive" 
                    ? buttonVariants({ variant: "destructive" })
                    : ""
                )}
              >
                {selectedAction.alertConfirmText || "Konfirmasi"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

