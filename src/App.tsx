import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import Index from "./pages/Index";
import ReportBuilder from "./pages/ReportBuilder";
import TemplateAdmin from "./pages/TemplateAdmin";
import ReportsList from "./pages/ReportsList";
import ReportView from "./pages/ReportView";
import NotFound from "./pages/NotFound";
import TransfersLayout from "./pages/transfers/TransfersLayout";
import RequirementsList from "./pages/transfers/RequirementsList";
import PlayerPitches from "./pages/transfers/PlayerPitches";
import ScoutingTasks from "./pages/transfers/ScoutingTasks";
import UpcomingMatches from "./pages/transfers/UpcomingMatches";
import DataImportPage from "./pages/transfers/DataImport";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MainNavigation />
          <div className="pt-4">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/reports/new" element={
                <ProtectedRoute>
                  <ReportBuilder />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportsList />
                </ProtectedRoute>
              } />
              <Route path="/reports/:id" element={
                <ProtectedRoute>
                  <ReportView />
                </ProtectedRoute>
              } />
              <Route path="/admin/templates" element={
                <ProtectedRoute requiredRole="recruitment">
                  <TemplateAdmin />
                </ProtectedRoute>
              } />
              
              {/* Transfers routes */}
              <Route path="/transfers" element={
                <ProtectedRoute requiredRole="recruitment">
                  <TransfersLayout />
                </ProtectedRoute>
              }>
                <Route path="requirements" element={<RequirementsList />} />
                <Route path="pitches" element={<PlayerPitches />} />
                <Route path="scouting-tasks" element={<ScoutingTasks />} />
                <Route path="upcoming-matches" element={<UpcomingMatches />} />
                <Route path="data-import" element={<DataImportPage />} />
                <Route index element={<RequirementsList />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
