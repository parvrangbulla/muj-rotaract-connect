import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserDashboard from "./components/UserDashboard";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Domains from "./pages/Domains";
import Team from "./pages/Team";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import NGO from "./pages/NGO";
import AdminPastEvents from "./pages/AdminPastEvents";
import Profile from "./pages/Profile";
import AdminGBM from "./pages/AdminGBM";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const loginState = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loginState);
    };

    window.addEventListener('storage', handleStorageChange);
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
        <div className="min-h-screen bg-stone-50">
          <BrowserRouter>
            {isLoggedIn ? (
              <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/admin/past-events" element={<AdminPastEvents />} />
                <Route path="/admin/gbm" element={<AdminGBM />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<UserDashboard />} />
              </Routes>
            ) : (
              <>
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/event/:id" element={<EventDetail />} />
                    <Route path="/domains" element={<Domains />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/ngo" element={<NGO />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </>
            )}
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
