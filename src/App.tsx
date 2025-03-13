
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Repositories from "./pages/Repositories";
import CIConfiguration from "./pages/CIConfiguration";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper with NavBar
const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="flex-1 ml-16 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => (
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

export default App;
