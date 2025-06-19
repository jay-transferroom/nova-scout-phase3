
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import PlayerProfile from "./pages/PlayerProfile";
import ReportBuilder from "./pages/ReportBuilder";
import ReportsList from "./pages/ReportsList";
import ReportView from "./pages/ReportView";
import ReportEdit from "./pages/ReportEdit";
import ScoutingDashboard from "./pages/ScoutingDashboard";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SquadView from "./pages/SquadView";
import Shortlists from "./pages/Shortlists";
import SearchResults from "./pages/SearchResults";
import AISearch from "./pages/AISearch";
import AssignedPlayers from "./pages/AssignedPlayers";
import ScoutManagement from "./pages/ScoutManagement";
import TemplateAdmin from "./pages/TemplateAdmin";
import UserManagement from "./pages/admin/UserManagement";
import TransfersLayout from "./pages/transfers/TransfersLayout";
import RequirementsList from "./pages/transfers/RequirementsList";
import RequirementDetails from "./pages/transfers/RequirementDetails";
import ScoutingTasks from "./pages/transfers/ScoutingTasks";
import PlayerPitches from "./pages/transfers/PlayerPitches";
import UpcomingMatches from "./pages/transfers/UpcomingMatches";
import DataImport from "./pages/transfers/DataImport";
import { AuthContextProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppInitializer from "./components/AppInitializer";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Router>
          <AppInitializer>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Index />
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
                  path="/player/:id" 
                  element={
                    <ProtectedRoute>
                      <PlayerProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/report/new" 
                  element={
                    <ProtectedRoute>
                      <ReportBuilder />
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
                  path="/reports/:id" 
                  element={
                    <ProtectedRoute>
                      <ReportView />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports/:id/edit" 
                  element={
                    <ProtectedRoute>
                      <ReportEdit />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/scouting" 
                  element={
                    <ProtectedRoute>
                      <ScoutingDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute>
                      <Calendar />
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
                  path="/squad" 
                  element={
                    <ProtectedRoute>
                      <SquadView />
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
                  path="/search" 
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
                  path="/assigned-players" 
                  element={
                    <ProtectedRoute>
                      <AssignedPlayers />
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
                  path="/template-admin" 
                  element={
                    <ProtectedRoute>
                      <TemplateAdmin />
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
                  path="/transfers" 
                  element={
                    <ProtectedRoute>
                      <TransfersLayout />
                    </ProtectedRoute>
                  }
                >
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
              <Toaster />
            </div>
          </AppInitializer>
        </Router>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
