
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainNavigation />
        <div className="pt-4">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports/new" element={<ReportBuilder />} />
            <Route path="/reports" element={<ReportsList />} />
            <Route path="/reports/:id" element={<ReportView />} />
            <Route path="/admin/templates" element={<TemplateAdmin />} />
            
            {/* Transfers routes */}
            <Route path="/transfers" element={<TransfersLayout />}>
              <Route path="requirements" element={<RequirementsList />} />
              <Route path="pitches" element={<PlayerPitches />} />
              <Route path="scouting-tasks" element={<ScoutingTasks />} />
              <Route path="upcoming-matches" element={<UpcomingMatches />} />
              <Route path="data-import" element={<DataImportPage />} />
              <Route index element={<RequirementsList />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
