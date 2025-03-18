
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Repositories from "./pages/Repositories";
import CIConfiguration from "./pages/CIConfiguration";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Layout wrapper with NavBar
const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handler for resetting to home page (closing chat if active)
  const handleHomeClick = () => {
    if (location.pathname === '/home') {
      // We're on home, notify home component to reset the chat
      // The state update will be picked up by the Home component
      navigate('/home', { state: { resetChat: true }, replace: true });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-background/80">
      <NavBar onHomeLinkClick={handleHomeClick} />
      <div className="flex-1 ml-16 transition-all duration-300 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            
            {/* Protected routes with sidebar layout */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/repositories" element={<Repositories />} />
              <Route path="/ci-configuration" element={<CIConfiguration />} />
              <Route path="/users" element={<Users />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
