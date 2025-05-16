
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import BanhoTosa from "./pages/BanhoTosa";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ClientsList from "./components/clients/ClientsList"; 
import PetsList from "./components/pets/PetsList";
import AppointmentsList from "./components/appointments/AppointmentsList";
import GroomersList from "./components/groomers/GroomersList";
import PackagesList from "./components/packages/PackagesList";
import Reports from "./components/reports/Reports";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main App component
const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        
        {/* Rotas individuais para cada seção */}
        <Route path="/clients" element={<ProtectedRoute><ClientsList /></ProtectedRoute>} />
        <Route path="/pets" element={<ProtectedRoute><PetsList /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsList /></ProtectedRoute>} />
        <Route path="/groomers" element={<ProtectedRoute><GroomersList /></ProtectedRoute>} />
        <Route path="/packages" element={<ProtectedRoute><PackagesList /></ProtectedRoute>} />
        <Route path="/banho-tosa" element={<ProtectedRoute><BanhoTosa /></ProtectedRoute>} />
        <Route path="/reports" element={
          <ProtectedRoute>
            {isAdmin ? <Reports /> : <Navigate to="/" replace />}
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StoreProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
