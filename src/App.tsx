import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
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
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppInitializer from "./components/AppInitializer";
import Layout from "./components/Layout";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

// Component to handle the redirect with proper ID parameter
const PlayerRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/player/${id}`} replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppInitializer>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Index />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                {/* Redirect old plural route to singular route */}
                <Route 
                  path="/players/:id" 
                  element={<PlayerRedirect />}
                />
                <Route 
                  path="/player/:id" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PlayerProfile />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/report/new" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ReportBuilder />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ReportsList />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports/:id" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ReportView />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports/:id/edit" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ReportEdit />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/scouting" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ScoutingDashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Calendar />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/squad-view" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <SquadView />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/shortlists" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Shortlists />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <SearchResults />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ai-search" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AISearch />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/assigned-players" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AssignedPlayers />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/scout-management" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ScoutManagement />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/template-admin" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TemplateAdmin />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <UserManagement />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/transfers" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TransfersLayout />
                      </Layout>
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
