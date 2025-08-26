
import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png"
                alt="Rotaract Club MUJ Logo"
                className="h-12 w-12 object-contain"
              />
              <h3 className="text-xl font-bold">Rotaract Club MUJ</h3>
            </div>
            <p className="mb-4 text-gray-300">
              Rotaract Club of Manipal University Jaipur is dedicated to community service,
              professional development, and international understanding.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/rotaractclubmuj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-rotaract-orange transition-colors"
                title="@rotaractclubmuj"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:rotaract@muj.manipal.edu"
                className="text-white hover:text-rotaract-orange transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-rotaract-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-rotaract-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-rotaract-orange transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/domains" className="text-gray-300 hover:text-rotaract-orange transition-colors">
                  Domains
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-300 hover:text-rotaract-orange transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/ngo" className="text-gray-300 hover:text-rotaract-orange transition-colors">
                  NGO
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2 text-gray-300">
                Rotaract Club, Manipal University Jaipur
              </p>
              <p className="mb-2 text-gray-300">
                Dehmi Kalan, Near GVK Toll Plaza, Jaipur-Ajmer Expressway
              </p>
              <p className="mb-2 text-gray-300">Jaipur, Rajasthan 303007</p>
              <p className="mb-2 text-gray-300">
                <a href="mailto:rotaract@muj.manipal.edu" className="hover:text-rotaract-orange transition-colors">
                  rotaract@muj.manipal.edu
                </a>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Follow us: @rotaractclubmuj
              </p>
            </address>
          </div>
        </div>
        
        <hr className="border-gray-800 my-6" />
        
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Rotaract Club, Manipal University Jaipur. All rights reserved to Rotaract Club MUJ and <a href="https://www.linkedin.com/in/krish-gupta-51637b1b8/" target="_blank" rel="noopener noreferrer" className="hover:text-rotaract-orange transition-colors">Krish Gupta</a>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
