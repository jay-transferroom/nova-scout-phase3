
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppInitializer from "@/components/AppInitializer";
import Header from "@/components/Header";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ReportBuilder from "./pages/ReportBuilder";
import ReportView from "./pages/ReportView";
import ReportsList from "./pages/ReportsList";
import PlayerProfile from "./pages/PlayerProfile";
import ScoutingDashboard from "./pages/ScoutingDashboard";
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
              <div className="min-h-screen bg-background">
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <ScoutingDashboard />
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
                    path="/scouts"
                    element={
                      <ProtectedRoute>
                        <ScoutManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/templates"
                    element={
                      <ProtectedRoute>
                        <TemplateAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/squad"
                    element={
                      <ProtectedRoute>
                        <SquadView />
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
                  <Route
                    path="/transfers"
                    element={
                      <ProtectedRoute>
                        <TransfersLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<RequirementsList />} />
                    <Route path="requirements/:id" element={<RequirementDetails />} />
                    <Route path="pitches" element={<PlayerPitches />} />
                    <Route path="tasks" element={<ScoutingTasks />} />
                    <Route path="matches" element={<UpcomingMatches />} />
                    <Route path="import" element={<DataImport />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AppInitializer>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
