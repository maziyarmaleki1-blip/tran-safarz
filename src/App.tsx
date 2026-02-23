import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Rules from "./pages/Rules";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import OperatorDashboard from "./pages/OperatorDashboard";
import { ChatWidget } from "./components/support/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<OperatorDashboard />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatWidget />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
