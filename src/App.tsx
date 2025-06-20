
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppInitializer from "@/components/AppInitializer";
import Layout from "@/components/Layout";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import PlayerProfile from "@/pages/PlayerProfile";
import ScoutManagement from "@/pages/ScoutManagement";
import SquadView from "@/pages/SquadView";
import Calendar from "@/pages/Calendar";
import AssignedPlayers from "@/pages/AssignedPlayers";
import Shortlists from "@/pages/Shortlists";
import ReportsList from "@/pages/ReportsList";
import ReportBuilder from "@/pages/ReportBuilder";
import ReportView from "@/pages/ReportView";
import ReportEdit from "@/pages/ReportEdit";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import SearchResults from "@/pages/SearchResults";
import AISearch from "@/pages/AISearch";
import ScoutingDashboard from "@/pages/ScoutingDashboard";
import NotificationsList from "@/pages/NotificationsList";

// Admin pages
import UserManagement from "@/pages/admin/UserManagement";
import TemplateAdmin from "@/pages/TemplateAdmin";

// Transfer pages
import TransfersLayout from "@/pages/transfers/TransfersLayout";
import RequirementsList from "@/pages/transfers/RequirementsList";
import RequirementDetails from "@/pages/transfers/RequirementDetails";
import ScoutingTasks from "@/pages/transfers/ScoutingTasks";
import PlayerPitches from "@/pages/transfers/PlayerPitches";
import UpcomingMatches from "@/pages/transfers/UpcomingMatches";
import DataImport from "@/pages/transfers/DataImport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppInitializer>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/player/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <PlayerProfile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/scout-management" element={
                <ProtectedRoute>
                  <Layout>
                    <ScoutManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/squad-view" element={
                <ProtectedRoute>
                  <Layout>
                    <SquadView />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Layout>
                    <Calendar />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/assigned-players" element={
                <ProtectedRoute>
                  <Layout>
                    <AssignedPlayers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/shortlists" element={
                <ProtectedRoute>
                  <Layout>
                    <Shortlists />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsList />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/report-builder" element={
                <ProtectedRoute>
                  <Layout>
                    <ReportBuilder />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/report/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ReportView />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/report/:id/edit" element={
                <ProtectedRoute>
                  <Layout>
                    <ReportEdit />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout>
                    <NotificationsList />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <Layout>
                    <SearchResults />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/ai-search" element={
                <ProtectedRoute>
                  <Layout>
                    <AISearch />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/scouting-dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <ScoutingDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/templates" element={
                <ProtectedRoute>
                  <Layout>
                    <TemplateAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/transfers/*" element={
                <ProtectedRoute>
                  <TransfersLayout />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppInitializer>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
