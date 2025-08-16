
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Domains", path: "/domains" },
    { name: "Team", path: "/team" },
    { name: "NGO", path: "/ngo" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkLoginState = () => {
      const loginState = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loginState);
    };

    checkLoginState();

    const handleStorageChange = () => {
      checkLoginState();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white bg-opacity-95 shadow-md py-2"
          : "bg-black bg-opacity-80 py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* University Logo - Clickable link to MUJ website */}
            <a 
              href="https://jaipur.manipal.edu/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <img 
                src="/Manipal_University_Jaipur_logo.png" 
                alt="Manipal University Jaipur Logo" 
                className="h-10 w-10 object-contain"
              />
            </a>
            {/* Club Logo and Text - Links to home page */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
                alt="Rotaract Club MUJ Logo" 
                className="h-10 w-10 object-contain rounded-full border border-rotaract-orange/30"
              />
              <span className={`font-bold text-lg ${isScrolled ? "text-black" : "text-white"}`}>
                Rotaract MUJ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-rotaract-orange"
                    : isScrolled
                    ? "text-black hover:text-rotaract-orange"
                    : "text-white hover:text-rotaract-orange"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              onClick={handleAuthAction}
              className={`ml-4 ${
                isLoggedIn
                  ? "bg-black hover:bg-gray-800 text-white"
                  : "bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
              }`}
            >
              {isLoggedIn ? <LogOut className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={handleAuthAction}
              size="sm"
              className={
                isLoggedIn
                  ? "bg-black hover:bg-gray-800 text-white"
                  : "bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
              }
            >
              {isLoggedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className={isScrolled ? "text-black" : "text-white"} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 py-2 bg-white rounded-lg shadow-lg animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-2 text-sm font-medium ${
                  location.pathname === link.path
                    ? "text-rotaract-orange"
                    : "text-black hover:text-rotaract-orange"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
