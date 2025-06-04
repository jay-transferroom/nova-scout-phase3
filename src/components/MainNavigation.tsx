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
  FileText, 
  ArrowRight, 
  Users, 
  MapPin, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  User,
  Upload,
  Target,
  Brain
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
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      permission: "dashboard"
    },
    {
      title: "AI Search",
      url: "/ai-search",
      icon: Brain,
      permission: "dashboard" // Using dashboard permission as a baseline
    },
    {
      title: "Squad Analysis",
      url: "/squad",
      icon: Target,
      permission: "squad"
    },
    {
      title: "Player Reports",
      url: "/reports",
      icon: FileText,
      permission: "reports"
    },
    {
      title: "Requirements",
      url: "/transfers/requirements",
      icon: ArrowRight,
      permission: "requirements"
    },
    {
      title: "Player Pitches",
      url: "/transfers/pitches",
      icon: Users,
      permission: "pitches"
    },
    {
      title: "Scouting Tasks",
      url: "/transfers/scouting-tasks",
      icon: MapPin,
      permission: "scouting_tasks"
    },
    {
      title: "Upcoming Matches",
      url: "/transfers/upcoming-matches",
      icon: CalendarDays,
      permission: "upcoming_matches"
    },
    {
      title: "Data Import",
      url: "/transfers/data-import",
      icon: Upload,
      permission: "data_import"
    }
  ];

  const adminItems = [
    {
      title: "Template Admin",
      url: "/templates",
      icon: FileText,
      permission: "templates"
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
      permission: "user_management"
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
                .filter(item => hasPermission(item.permission))
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

        {profile?.role === 'recruitment' && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems
                  .filter(item => hasPermission(item.permission))
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
        )}

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
