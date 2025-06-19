
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PlayerProfile from "./pages/PlayerProfile";
import ReportBuilder from "./pages/ReportBuilder";
import ReportView from "./pages/ReportView";
import ReportEdit from "./pages/ReportEdit";
import ReportsList from "./pages/ReportsList";
import Profile from "./pages/Profile";
import ScoutManagement from "./pages/ScoutManagement";
import UserManagement from "./pages/admin/UserManagement";
import TemplateAdmin from "./pages/TemplateAdmin";
import SquadView from "./pages/SquadView";
import ScoutingDashboard from "./pages/ScoutingDashboard";
import AssignedPlayers from "./pages/AssignedPlayers";
import Shortlists from "./pages/Shortlists";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AISearch from "./pages/AISearch";
import SearchResults from "./pages/SearchResults";
import TransfersLayout from "./pages/transfers/TransfersLayout";
import RequirementsList from "./pages/transfers/RequirementsList";
import RequirementDetails from "./pages/transfers/RequirementDetails";
import ScoutingTasks from "./pages/transfers/ScoutingTasks";
import PlayerPitches from "./pages/transfers/PlayerPitches";
import UpcomingMatches from "./pages/transfers/UpcomingMatches";
import DataImport from "./pages/transfers/DataImport";
import AppInitializer from "./components/AppInitializer";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AppInitializer>
              <Layout>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/player/:id" element={<ProtectedRoute><PlayerProfile /></ProtectedRoute>} />
                  <Route path="/reports/new" element={<ProtectedRoute><ReportBuilder /></ProtectedRoute>} />
                  <Route path="/reports/:id/edit" element={<ProtectedRoute><ReportEdit /></ProtectedRoute>} />
                  <Route path="/reports/:id" element={<ProtectedRoute><ReportView /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><ReportsList /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/scout-management" element={<ProtectedRoute><ScoutManagement /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                  <Route path="/admin/templates" element={<ProtectedRoute><TemplateAdmin /></ProtectedRoute>} />
                  <Route path="/squad" element={<ProtectedRoute><SquadView /></ProtectedRoute>} />
                  <Route path="/scouting" element={<ProtectedRoute><ScoutingDashboard /></ProtectedRoute>} />
                  <Route path="/assigned-players" element={<ProtectedRoute><AssignedPlayers /></ProtectedRoute>} />
                  <Route path="/shortlists" element={<ProtectedRoute><Shortlists /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/ai-search" element={<ProtectedRoute><AISearch /></ProtectedRoute>} />
                  <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
                  <Route path="/transfers" element={<ProtectedRoute><TransfersLayout /></ProtectedRoute>}>
                    <Route index element={<RequirementsList />} />
                    <Route path="requirements" element={<RequirementsList />} />
                    <Route path="requirements/:id" element={<RequirementDetails />} />
                    <Route path="scouting-tasks" element={<ScoutingTasks />} />
                    <Route path="player-pitches" element={<PlayerPitches />} />
                    <Route path="upcoming-matches" element={<UpcomingMatches />} />
                    <Route path="data-import" element={<DataImport />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </AppInitializer>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
