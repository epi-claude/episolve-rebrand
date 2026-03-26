import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Insights from "./pages/Insights";
import InsightDetail from "./pages/InsightDetail";
import CaseStudies from "./pages/CaseStudies";
import RiskInsurance from "./pages/RiskInsurance";
import FractionalTechnologyOffice from "./pages/FractionalTechnologyOffice";
import IntelligentAutomation from "./pages/IntelligentAutomation";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Diametica from "./pages/Diametica";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeToggle />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<InsightDetail />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/solutions/risk-insurance" element={<RiskInsurance />} />
            <Route path="/solutions/fractional-technology-office" element={<FractionalTechnologyOffice />} />
            <Route path="/solutions/intelligent-automation" element={<IntelligentAutomation />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route path="/diametica" element={<Diametica />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;