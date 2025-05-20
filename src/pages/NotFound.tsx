
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-rotaract-orange text-9xl font-bold mb-4">404</div>
        <h1 className="text-3xl font-bold mb-6">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you were looking for doesn't exist or has been moved.
          Let's get you back to the homepage.
        </p>
        <Button asChild className="bg-rotaract-orange hover:bg-orange-600 text-white">
          <Link to="/" className="inline-flex items-center">
            <Home className="mr-2 h-4 w-4" /> Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
