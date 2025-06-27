
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Header from "./Header";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainNavigation />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6 pt-20">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
