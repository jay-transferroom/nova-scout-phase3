import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import PlayerProfile from "./pages/PlayerProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Reports from "./pages/Reports";
import Report from "./pages/Report";
import ReportBuilder from "./pages/ReportBuilder";
import SearchResults from "./pages/SearchResults";
import Calendar from "./pages/Calendar";
import PrivatePlayerProfile from "@/pages/PrivatePlayerProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Index />
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
            <Route path="/player/:id" element={
              <ProtectedRoute>
                <Layout>
                  <PlayerProfile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/report/:id" element={
              <ProtectedRoute>
                <Layout>
                  <Report />
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
            <Route path="/search" element={
              <ProtectedRoute>
                <Layout>
                  <SearchResults />
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
            <Route 
              path="/private-player/:id" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <PrivatePlayerProfile />
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
