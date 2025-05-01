
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Search, FileText, ArrowRight, Users, MapPin, CalendarDays } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MainNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <NavigationMenu className="mx-auto max-w-none w-full px-4 py-2 border-b">
      <NavigationMenuList className="justify-start space-x-4">
        <NavigationMenuItem>
          <Link to="/" className={cn(
            navigationMenuTriggerStyle(),
            isActive("/") && location.pathname === "/" ? "bg-accent" : ""
          )}>
            <Search className="h-4 w-4 mr-2" />
            <span>Search</span>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/reports" className={cn(
            navigationMenuTriggerStyle(),
            isActive("/reports") ? "bg-accent" : ""
          )}>
            <FileText className="h-4 w-4 mr-2" />
            <span>Player Reports</span>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className={isActive("/transfers") ? "bg-accent" : ""}>
            <ArrowRight className="h-4 w-4 mr-2" />
            <span>Transfers In</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    to="/transfers/requirements"
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Player Requirements
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Create and manage requirements for players your club is looking for
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/transfers/pitches"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Player Pitches</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Review proposals from clubs and agents
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/transfers/scouting-tasks"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>Scouting Tasks</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      View assigned players to scout based on location
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/transfers/upcoming-matches"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span>Upcoming Matches</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Schedule of upcoming matches for scouting
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
