
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
import { FileText, ArrowRight, Users, MapPin, CalendarDays } from "lucide-react";

const MainNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navigationItems = [
    {
      title: "Player Reports",
      url: "/reports",
      icon: FileText,
    }
  ];

  const transferItems = [
    {
      title: "Requirements",
      url: "/transfers/requirements",
      icon: ArrowRight,
    },
    {
      title: "Player Pitches",
      url: "/transfers/pitches",
      icon: Users,
    },
    {
      title: "Scouting Tasks",
      url: "/transfers/scouting-tasks",
      icon: MapPin,
    },
    {
      title: "Upcoming Matches",
      url: "/transfers/upcoming-matches",
      icon: CalendarDays,
    }
  ];
  
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
          <SidebarGroupLabel>Transfers In</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {transferItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
