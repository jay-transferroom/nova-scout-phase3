
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppInitializer from "@/components/AppInitializer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import MainNavigation from "@/components/MainNavigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserManagement from "./pages/admin/UserManagement";
import ReportsList from "./pages/ReportsList";
import ReportBuilder from "./pages/ReportBuilder";
import ReportView from "./pages/ReportView";
import PlayerProfile from "./pages/PlayerProfile";
import ScoutingDashboard from "./pages/ScoutingDashboard";
import TemplateAdmin from "./pages/TemplateAdmin";
import DataImportPage from "./pages/transfers/DataImport";
import TransfersLayout from "./pages/transfers/TransfersLayout";
import PlayerPitches from "./pages/transfers/PlayerPitches";
import RequirementsList from "./pages/transfers/RequirementsList";
import ScoutingTasks from "./pages/transfers/ScoutingTasks";
import UpcomingMatches from "./pages/transfers/UpcomingMatches";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isAuthPage) {
    return (
      <main className="flex-1">
        <Routes>
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainNavigation />
        <SidebarInset>
          <Header />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="recruitment">
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportsList />
                </ProtectedRoute>
              } />
              <Route path="/reports/new" element={
                <ProtectedRoute>
                  <ReportBuilder />
                </ProtectedRoute>
              } />
              <Route path="/reports/:id" element={
                <ProtectedRoute>
                  <ReportView />
                </ProtectedRoute>
              } />
              <Route path="/players/:id" element={
                <ProtectedRoute>
                  <PlayerProfile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <ScoutingDashboard />
                </ProtectedRoute>
              } />
              <Route path="/templates" element={
                <ProtectedRoute allowedRoles={['recruitment']}>
                  <TemplateAdmin />
                </ProtectedRoute>
              } />
              <Route path="/transfers" element={
                <ProtectedRoute>
                  <TransfersLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DataImportPage />} />
                <Route path="data-import" element={<DataImportPage />} />
                <Route path="pitches" element={<PlayerPitches />} />
                <Route path="requirements" element={<RequirementsList />} />
                <Route path="scouting-tasks" element={<ScoutingTasks />} />
                <Route path="upcoming-matches" element={<UpcomingMatches />} />
              </Route>
            </Routes>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppInitializer>
          <Toaster />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AppInitializer>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
