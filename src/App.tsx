
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserSidebar from "./components/UserSidebar";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Domains from "./pages/Domains";
import Team from "./pages/Team";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Listen for login state changes from Navbar
  useEffect(() => {
    const handleStorageChange = () => {
      const loginState = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loginState);
      if (loginState) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check initial state
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/domains" element={<Domains />} />
              <Route path="/team" element={<Team />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          
          {/* User Sidebar */}
          <UserSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          
          {/* Floating sidebar toggle when logged in */}
          {isLoggedIn && !isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed bottom-6 right-6 bg-rotaract-orange hover:bg-rotaract-orange/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
            >
              <Calendar className="w-6 h-6" />
            </button>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
