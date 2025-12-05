import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface BreadcrumbItem {
    title: string
    url: string
}

export function AppAdmin({ children, breadcrumb }: { children: React.ReactNode, breadcrumb: BreadcrumbItem[] }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
       <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumbs breadcrumbs={breadcrumb} />
          </div>
        </header>
        <div className="gap-4 p-4 pt-0">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}