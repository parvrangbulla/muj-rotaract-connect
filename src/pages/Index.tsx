
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  const handleBecomeMember = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeN_0YXl6S4QJrcTJXSfPk_j0Ev_42DUAh6KPnYbYqzd1hVEA/viewform', '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <AnimatedBackground />
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        
        {/* Content */}
        <div className="container mx-auto px-4 text-center text-white z-10 relative">
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 w-80 h-80 rounded-full border-2 border-rotaract-orange/40 animate-spin" style={{animationDuration: '8s'}}></div>
              
              {/* Middle pulsing ring */}
              <div className="absolute inset-2 w-76 h-76 rounded-full border border-white/30 animate-ping" style={{animationDelay: '1s'}}></div>
              
              {/* Background circle for logo */}
              <div className="absolute inset-4 w-72 h-72 rounded-full bg-gradient-to-br from-rotaract-orange/20 via-white/10 to-rotaract-orange/30 backdrop-blur-sm border border-white/20"></div>
              
              {/* Logo with enhanced animations - made smaller */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
                  alt="Rotaract Club MUJ Logo" 
                  className="w-56 h-56 object-contain z-10 rounded-full group-hover:scale-110 transition-all duration-500 filter drop-shadow-2xl"
                  style={{
                    animation: 'logoFloat 3s ease-in-out infinite, logoGlow 2s ease-in-out infinite alternate'
                  }}
                />
              </div>
              
              {/* Inner glowing effect */}
              <div className="absolute inset-12 w-56 h-56 rounded-full bg-gradient-to-r from-rotaract-orange/30 to-white/30 blur-md animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
          
          {/* Custom keyframes for logo animations */}
          <style>{`
            @keyframes logoFloat {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(5deg); }
            }
            
            @keyframes logoGlow {
              0% { filter: drop-shadow(0 0 15px rgba(245, 145, 32, 0.6)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.4)); }
              100% { filter: drop-shadow(0 0 25px rgba(245, 145, 32, 0.9)) drop-shadow(0 0 35px rgba(255, 255, 255, 0.6)); }
            }
          `}</style>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-up bg-gradient-to-r from-white via-rotaract-orange to-white bg-clip-text text-transparent">
            Rotaract Club
          </h1>
          <h2 className="text-2xl md:text-4xl font-medium mb-6 animate-fade-up text-gray-200" style={{animationDelay: '200ms'}}>
            Manipal University Jaipur
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up text-gray-300" style={{animationDelay: '400ms'}}>
            Service Above Self
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-up" style={{animationDelay: '600ms'}}>
            <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0">
              <Link to="/about">About Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link to="/events">Our Events</Link>
            </Button>
          </div>
        </div>

        {/* Instagram Icon */}
        <div className="absolute bottom-6 right-6 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://instagram.com/rotaractclubmuj', '_blank')}
            className="text-white hover:text-rotaract-orange hover:bg-white/10 rounded-full"
          >
            <Instagram className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-black">About Rotaract MUJ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-6 text-gray-700">
                Rotaract Club of Manipal University Jaipur is a dynamic organization
                dedicated to professional development and community service.
                As part of Rotary International, we strive to make a positive impact
                on our campus and in the local community.
              </p>
              <p className="text-lg mb-6 text-gray-700">
                Our members develop leadership skills, engage in meaningful service
                projects, and build a network of friends and professionals who share
                a vision of creating positive change.
              </p>
              <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white">
                <Link to="/about" className="inline-flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1529156066841-6116e61058f4?q=80&w=3432&auto=format&fit=crop" 
                alt="Rotaract members" 
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Events Section - Made visible without hovering */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-black">Our Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Blood Donation Camp Card */}
            <Card className="overflow-hidden transition-all hover:shadow-lg border-gray-200 hover:border-rotaract-orange">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" 
                  alt="Blood Donation Camp" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-black">Blood Donation Camp (BDC)</h3>
                <p className="text-gray-600 mb-4">
                  Our annual Blood Donation Camp encourages students and faculty to donate blood and
                  raise awareness about the importance of blood donation in saving lives.
                </p>
                <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white">
                  <Link to="/events" className="inline-flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Daan Utsav Card */}
            <Card className="overflow-hidden transition-all hover:shadow-lg border-gray-200 hover:border-rotaract-orange">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop" 
                  alt="Daan Utsav" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-black">Daan Utsav</h3>
                <p className="text-gray-600 mb-4">
                  Daan Utsav is our festival of giving where we organize donation
                  drives to help the underprivileged communities with clothes, books,
                  food, and other essential items.
                </p>
                <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white">
                  <Link to="/events" className="inline-flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Domains</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* CSD Domain */}
            <div className="text-center">
              <div className="bg-rotaract-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">CSD</h3>
              <p className="mb-4">Club Service Domain</p>
              <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* CMD Domain */}
            <div className="text-center">
              <div className="bg-rotaract-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">CMD</h3>
              <p className="mb-4">Community Service Domain</p>
              <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* ISD Domain */}
            <div className="text-center">
              <div className="bg-rotaract-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">ISD</h3>
              <p className="mb-4">International Service Domain</p>
              <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* PDD Domain */}
            <div className="text-center">
              <div className="bg-rotaract-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">PDD</h3>
              <p className="mb-4">Professional Development Domain</p>
              <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Explore More About Rotaract MUJ</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-600">
            Check out our events, meet our team, and learn more about how you can get involved
            with Rotaract Club at Manipal University Jaipur.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white">
              <Link to="/events" className="inline-flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> View Events
              </Link>
            </Button>
            <Button asChild className="bg-black hover:bg-gray-900 text-white">
              <Link to="/team" className="inline-flex items-center">
                <Users className="mr-2 h-4 w-4" /> Meet Our Team
              </Link>
            </Button>
            <Button 
              onClick={handleBecomeMember}
              variant="outline" 
              className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white"
            >
              <Users className="mr-2 h-4 w-4" /> Become a Member
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
