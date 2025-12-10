"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { hasAccess } from "@/helpers/auth"

type NavSubItem = {
  title: string
  url: string
  roles?: string[]
  permissions?: string[]
}

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  group?: string
  roles?: string[]
  permissions?: string[]
  items?: NavSubItem[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation()
  const currentPath = location.pathname

  const isItemActive = (url: string) => {
    if (url === "#") return false
    return currentPath === url || currentPath.startsWith(url + "/")
  }

  const isSubItemActive = (url: string) => {
    if (url === "#") return false
    return currentPath === url || currentPath.startsWith(url + "/")
  }

  const renderMenuItem = (item: NavItem) => {
    const itemActive = isItemActive(item.url)
    const hasActiveSubItem = item.items?.some((subItem) => isSubItemActive(subItem.url))
    const shouldBeOpen = itemActive || hasActiveSubItem || item.isActive

    return (
      <Collapsible key={item.title} asChild defaultOpen={shouldBeOpen}>
        <SidebarMenuItem>
          {item.items?.length ? (
            <CollapsibleTrigger asChild>
              <SidebarMenuButton 
                tooltip={item.title} 
                className="group"
                isActive={hasActiveSubItem}
              >
                <item.icon />
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          ) : (
            <SidebarMenuButton 
              asChild 
              tooltip={item.title}
              isActive={itemActive}
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
          {item.items?.length ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => {
                  const subItemActive = isSubItemActive(subItem.url)
                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={subItemActive}>
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  // Group items while maintaining original array order
  const accessibleItems = items
    .map((item) => {
      const filteredSubItems = item.items?.filter((subItem) =>
        hasAccess({
          roles: subItem.roles ?? [],
          permissions: subItem.permissions ?? [],
        })
      )

      return {
        ...item,
        items: filteredSubItems,
      }
    })
    .filter((item) =>
      hasAccess({
        roles: item.roles ?? [],
        permissions: item.permissions ?? [],
      })
    )

  const groups: Array<{ groupName: string; items: NavItem[] }> = []
  let currentGroup: { groupName: string; items: NavItem[] } | null = null

  accessibleItems.forEach((item) => {
    const groupName = item.group || ""
    
    if (groupName) {
      // If this item has a group
      if (currentGroup && currentGroup.groupName === groupName) {
        // Same group as previous item, add to current group
        currentGroup.items.push(item)
      } else {
        // New group or different group, start a new group
        if (currentGroup) {
          groups.push(currentGroup)
        }
        currentGroup = { groupName, items: [item] }
      }
    } else {
      // Item without group
      if (currentGroup) {
        // Close previous group first
        groups.push(currentGroup)
        currentGroup = null
      }
      // Add as separate group without label
      groups.push({ groupName: "", items: [item] })
    }
  })

  // Don't forget the last group
  if (currentGroup) {
    groups.push(currentGroup)
  }

  return (
    <>
      {groups.map((group, groupIndex) => (
        <SidebarGroup 
          key={`${group.groupName}-${groupIndex}`}
          className={cn(
            groupIndex > 0 && "-mt-2",
            "py-1"
          )}
        >
          {group.groupName && <SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.items.map((item) => renderMenuItem(item))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
