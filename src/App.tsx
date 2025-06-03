
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppInitializer from "@/components/AppInitializer";
import MainNavigation from "@/components/MainNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/pages/Dashboard";
import SquadView from "@/pages/SquadView";
import ReportsList from "@/pages/ReportsList";
import ReportView from "@/pages/ReportView";
import ReportEdit from "@/pages/ReportEdit";
import RequirementsList from "@/pages/transfers/RequirementsList";
import RequirementDetails from "@/pages/transfers/RequirementDetails";
import PlayerPitches from "@/pages/transfers/PlayerPitches";
import ScoutingTasks from "@/pages/transfers/ScoutingTasks";
import UpcomingMatches from "@/pages/transfers/UpcomingMatches";
import DataImport from "@/pages/transfers/DataImport";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Toaster />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppInitializer>
                    <SidebarProvider>
                      <div className="flex w-full">
                        <MainNavigation />
                        <main className="flex-1 overflow-hidden">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/squad" element={<SquadView />} />
                            <Route path="/reports" element={<ReportsList />} />
                            <Route path="/reports/:id" element={<ReportView />} />
                            <Route path="/reports/:id/edit" element={<ReportEdit />} />
                            <Route path="/transfers/requirements" element={<RequirementsList />} />
                            <Route path="/transfers/requirements/:id" element={<RequirementDetails />} />
                            <Route path="/transfers/pitches" element={<PlayerPitches />} />
                            <Route path="/transfers/scouting-tasks" element={<ScoutingTasks />} />
                            <Route path="/transfers/upcoming-matches" element={<UpcomingMatches />} />
                            <Route path="/transfers/data-import" element={<DataImport />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<Dashboard />} />
                          </Routes>
                        </main>
                      </div>
                    </SidebarProvider>
                  </AppInitializer>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
