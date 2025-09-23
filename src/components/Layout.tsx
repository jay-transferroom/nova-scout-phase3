
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Header from "./Header";
import ChatOverlay from "./ChatOverlay";
import { useState } from "react";

const Layout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <MainNavigation onAIAssistantClick={() => setIsChatOpen(true)} />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6 pt-20">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
      <ChatOverlay 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </SidebarProvider>
  );
};

export default Layout;
