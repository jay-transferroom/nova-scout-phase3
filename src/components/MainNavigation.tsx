
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Home,
  Kanban,
  Calendar,
  UserCheck,
  Bookmark,
  FileText,
  Settings,
  User,
  Users
} from "lucide-react";
import { useMyPermissions } from "@/hooks/useUserPermissions";
import { useAuth } from "@/contexts/AuthContext";

const MainNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const { data: permissions } = useMyPermissions();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const hasPermission = (permission: string) => {
    return permissions?.[permission] !== false;
  };

  const mainItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      permission: "dashboard"
    },
    {
      title: "Scout Management",
      url: "/scout-management",
      icon: Kanban,
      permission: "user_management",
      restricted: true // Only for Scout Managers
    },
    {
      title: "Squad View",
      url: "/squad-view",
      icon: Users,
      permission: "dashboard",
      restricted: true // Only for Scout Managers
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      permission: "dashboard"
    },
    {
      title: "Assigned Players",
      url: "/assigned-players",
      icon: UserCheck,
      permission: "dashboard"
    },
    {
      title: "Shortlists",
      url: "/shortlists",
      icon: Bookmark,
      permission: "dashboard"
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      permission: "reports"
    }
  ];

  const accountItems = [
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    }
  ];
  
  return (
    <Sidebar collapsible="icon" className="border-r z-40">
      <SidebarContent className="pt-20 pb-4">
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems
                .filter(item => {
                  if (item.restricted && profile?.role !== 'recruitment') {
                    return false;
                  }
                  return hasPermission(item.permission);
                })
                .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default MainNavigation;
