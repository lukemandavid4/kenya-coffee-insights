import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Auctions from "./pages/Auctions";
import Production from "./pages/Production";
import CountyMap from "./pages/CountyMap";
import Weather from "./pages/Weather";
import Market from "./pages/Market";
import Insights from "./pages/Insights";
import FarmerHarvest from "./pages/FarmerHarvest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Auth />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/auctions" element={<ProtectedRoute><Auctions /></ProtectedRoute>} />
    <Route path="/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
    <Route path="/map" element={<ProtectedRoute><CountyMap /></ProtectedRoute>} />
    <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
    <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
    <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
    <Route path="/harvest" element={<ProtectedRoute><FarmerHarvest /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
