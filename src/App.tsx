
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Auth from "./pages/Auth";
import AccountSetup from "./pages/AccountSetup";
import Home from "./pages/Home";
import Repositories from "./pages/Repositories";
import CIConfiguration from "./pages/CIConfiguration";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { RepositoryProvider, useRepositories } from "./contexts/RepositoryContext";

const queryClient = new QueryClient();

// Layout wrapper with NavBar
const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { repositories, updateRepositoryStatus } = useRepositories();

  // Handler for resetting to home page (closing chat if active)
  const handleHomeClick = () => {
    if (location.pathname === '/home') {
      // We're on home, notify home component to reset the chat
      // The state update will be picked up by the Home component
      navigate('/home', { state: { resetChat: true }, replace: true });
    }
  };

  // Handler for navigating from CI configuration to repositories
  const handleNavigateFromCI = () => {
    const currentRepo = repositories.find(repo => repo.name === 'infrastructure');
    if (currentRepo) {
      updateRepositoryStatus('infrastructure', 'npm');
    }
  };

  return (
    <div className="flex h-screen space-gradient tech-grid">
      <NavBar 
        onHomeLinkClick={handleHomeClick} 
        onExpandChange={setSidebarExpanded} 
        onNavigateFromCI={handleNavigateFromCI}
      />
      <div 
        className={`flex-1 transition-all duration-300 overflow-auto ${
          sidebarExpanded ? 'ml-56' : 'ml-16'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  // Set dark mode as default
  useEffect(() => {
    // First add dark mode class immediately
    document.documentElement.classList.add('dark');
    
    // Then add transitions after a small delay to prevent initial transition
    setTimeout(() => {
      document.documentElement.classList.add('init-transitions');
    },100);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RepositoryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/account-setup" element={<AccountSetup />} />
              
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
        </RepositoryProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
