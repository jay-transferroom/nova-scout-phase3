import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppInitializer from "@/components/AppInitializer";
import Header from "@/components/Header";
import MainNavigation from "@/components/MainNavigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ReportBuilder from "./pages/ReportBuilder";
import ReportView from "./pages/ReportView";
import ReportsList from "./pages/ReportsList";
import PlayerProfile from "./pages/PlayerProfile";
import ScoutingDashboard from "./pages/ScoutingDashboard";
import Calendar from "./pages/Calendar";
import AssignedPlayers from "./pages/AssignedPlayers";
import Shortlists from "./pages/Shortlists";
import ScoutManagement from "./pages/ScoutManagement";
import UserManagement from "./pages/admin/UserManagement";
import TemplateAdmin from "./pages/TemplateAdmin";
import SquadView from "./pages/SquadView";
import SearchResults from "./pages/SearchResults";
import AISearch from "./pages/AISearch";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Import transfer pages
import TransfersLayout from "./pages/transfers/TransfersLayout";
import RequirementsList from "./pages/transfers/RequirementsList";
import RequirementDetails from "./pages/transfers/RequirementDetails";
import PlayerPitches from "./pages/transfers/PlayerPitches";
import ScoutingTasks from "./pages/transfers/ScoutingTasks";
import UpcomingMatches from "./pages/transfers/UpcomingMatches";
import DataImport from "./pages/transfers/DataImport";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppInitializer>
              <SidebarProvider>
                <div className="min-h-screen bg-background flex w-full">
                  <MainNavigation />
                  <SidebarInset>
                    <Header />
                    <main className="flex-1 p-6">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route
                          path="/calendar"
                          element={
                            <ProtectedRoute>
                              <Calendar />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/assigned-players"
                          element={
                            <ProtectedRoute>
                              <AssignedPlayers />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/shortlists"
                          element={
                            <ProtectedRoute>
                              <Shortlists />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/scout-management"
                          element={
                            <ProtectedRoute>
                              <ScoutManagement />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports/new"
                          element={
                            <ProtectedRoute>
                              <ReportBuilder />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports/:id"
                          element={
                            <ProtectedRoute>
                              <ReportView />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports"
                          element={
                            <ProtectedRoute>
                              <ReportsList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/players/:id"
                          element={
                            <ProtectedRoute>
                              <PlayerProfile />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/search-results"
                          element={
                            <ProtectedRoute>
                              <SearchResults />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/ai-search"
                          element={
                            <ProtectedRoute>
                              <AISearch />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <Settings />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </AppInitializer>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
