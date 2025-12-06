"use client"

import * as React from "react"
import {
  Command,
  Home,
  LogOut,
  Settings2,
  Settings,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Content Pages",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "Create Page",
          url: "/pages/create",
        },
        {
          title: "List Pages",
          url: "/pages",
        }
      ],
    },
    {
      title: "Content Posts",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "Create Post",
          url: "/posts/create",
        },
        {
          title: "List Posts",
          url: "/posts",
        }
      ],
    },
    {
      title: "Authorization",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "Roles",
          url: "/roles",
          roles: [],
          permissions: ["roles.view"],
        },
        {
          title: "Permissions",
          url: "/permissions",
          roles: [],
          permissions: ["permissions.view"],
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
  ],  
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Logout",
      url: "#",
      icon: LogOut,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Admin Panel</span>
                  <span className="truncate text-xs">Manage your dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
