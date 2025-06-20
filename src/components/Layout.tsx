
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MainNavigation from "./MainNavigation";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainNavigation />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6 pt-20">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
