import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Image, ChevronDown } from "lucide-react";
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
            <div className="relative group">
              <div className="w-80 h-80 rounded-full border-2 border-rotaract-orange/20 bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-sm shadow-2xl hover:shadow-rotaract-orange/30 transition-all duration-300">
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
                    alt="Rotaract Club MUJ Logo" 
                    className="w-56 h-56 object-contain z-10 rounded-full group-hover:scale-125 transition-all duration-500 filter drop-shadow-2xl" 
                    style={{
                      animation: '3s ease-in-out 0s infinite normal none running logoUpDown, 2s ease-in-out 0s infinite normal none running logoFloat, 1.5s ease-in-out 0s infinite alternate none running logoGlow, 1.2s ease-in-out 0s infinite normal none running logoBounce, 3s ease-in-out 0s infinite normal none running logoPulse, 4s ease-in-out 0s infinite normal none running logoRipple'
                    }}
                  />
                </div>
                
                {/* Background glow effect */}
                <div className="absolute inset-12 w-56 h-56 rounded-full bg-gradient-to-r from-rotaract-orange/5 to-white/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Enhanced ripple effect circles emanating from the logo */}
                <div className="absolute inset-0 w-80 h-80 rounded-full border-2 border-rotaract-orange/40 animate-ping opacity-30"></div>
                <div className="absolute inset-2 w-76 h-76 rounded-full border-2 border-rotaract-orange/30 animate-ping opacity-25" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute inset-4 w-72 h-72 rounded-full border-2 border-rotaract-orange/25 animate-ping opacity-20" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute inset-6 w-68 h-68 rounded-full border-2 border-rotaract-orange/20 animate-ping opacity-15" style={{ animationDelay: '0.9s' }}></div>
                <div className="absolute inset-8 w-64 h-64 rounded-full border-2 border-rotaract-orange/15 animate-ping opacity-10" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute inset-10 w-60 h-60 rounded-full border-2 border-rotaract-orange/10 animate-ping opacity-5" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </div>
          </div>
          
          {/* Enhanced keyframes for logo animations */}
          <style>{`
            @keyframes logoUpDown {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            
            @keyframes logoFloat {
              0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
              10% { transform: translateY(-5px) rotate(1deg) scale(1.01); }
              20% { transform: translateY(-10px) rotate(2deg) scale(1.02); }
              30% { transform: translateY(-15px) rotate(3deg) scale(1.03); }
              40% { transform: translateY(-20px) rotate(4deg) scale(1.04); }
              50% { transform: translateY(-25px) rotate(5deg) scale(1.05); }
              60% { transform: translateY(-20px) rotate(4deg) scale(1.04); }
              70% { transform: translateY(-15px) rotate(3deg) scale(1.03); }
              80% { transform: translateY(-10px) rotate(2deg) scale(1.02); }
              90% { transform: translateY(-5px) rotate(1deg) scale(1.01); }
            }
            
            @keyframes logoGlow {
              0% { filter: drop-shadow(0 0 15px rgba(245, 145, 32, 0.6)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.4)); }
              50% { filter: drop-shadow(0 0 25px rgba(245, 145, 32, 0.9)) drop-shadow(0 0 35px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 35px rgba(245, 145, 32, 0.4)); }
              100% { filter: drop-shadow(0 0 35px rgba(245, 145, 32, 1)) drop-shadow(0 0 45px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 55px rgba(245, 145, 32, 0.6)); }
            }
            
            @keyframes logoBounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
              10% { transform: translateY(-3px) scale(1.02); }
              30% { transform: translateY(-8px) scale(1.05); }
              40% { transform: translateY(-12px) scale(1.08); }
              60% { transform: translateY(-6px) scale(1.03); }
              70% { transform: translateY(-2px) scale(1.01); }
            }
            
            @keyframes logoPulse {
              0%, 100% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.03) rotate(1deg); }
              50% { transform: scale(1.06) rotate(2deg); }
              75% { transform: scale(1.03) rotate(1deg); }
            }
            
            @keyframes logoRipple {
              0% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.02) rotate(1deg); }
              50% { transform: scale(1.05) rotate(2deg); }
              75% { transform: scale(1.02) rotate(1deg); }
              100% { transform: scale(1) rotate(0deg); }
            }
            
            @keyframes scrollBounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
          `}</style>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-up bg-gradient-to-r from-white via-rotaract-orange to-white bg-clip-text text-transparent">
            Rotaract Club
          </h1>
          <h2 className="text-2xl md:text-4xl font-medium mb-6 animate-fade-up text-gray-200" style={{
            animationDelay: '200ms'
          }}>
            Manipal University Jaipur
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up text-gray-300" style={{
            animationDelay: '400ms'
          }}>
            Service Above Self
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-up" style={{
            animationDelay: '600ms'
          }}>
            <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0 text-sm md:text-base py-2 md:py-3">
              <Link to="/about">About Us</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0 text-sm md:text-base py-2 md:py-3">
              <Link to="/events">Our Events</Link>
            </Button>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-up" style={{
            animationDelay: '800ms'
          }}>
            <div className="flex flex-col items-center">
              
              
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-black">About Rotaract MUJ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-6 text-gray-700">
                Rotaract Club of Manipal University Jaipur is an energetic and impactful organization 
                committed to fostering professional growth and driving community service initiatives. 
                As a proud part of Rotary International, we aim to inspire change, empower youth, 
                and make a lasting difference both on campus and in the wider community.
              </p>
              <p className="text-lg mb-6 text-gray-700">
                Our members actively develop leadership skills, take part in impactful service projects, 
                and cultivate a strong network of peers and professionals united by the vision of creating 
                meaningful, positive change in society.
              </p>
              <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white transform hover:scale-105 transition-all duration-300">
                <Link to="/about" className="inline-flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <img src="https://images.unsplash.com/photo-1529156066841-6116e61058f4?q=80&w=3432&auto=format&fit=crop" alt="Rotaract members" className="rounded-lg shadow-lg max-w-full h-auto transform hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Events Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-black">Our Flagship Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12">
            {/* Blood Donation Camp Card */}
            <Card className="overflow-hidden transition-all hover:shadow-xl border-gray-200 hover:border-rotaract-orange transform hover:scale-105 duration-300">
              <div className="h-48 md:h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" alt="Blood Donation Camp" className="w-full h-full object-cover transition-transform hover:scale-110 duration-300" />
              </div>
              <CardContent className="p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-black">Blood Donation Camp (BDC)</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  The Blood Donation Camp is one of Rotaract Club of MUJ's most impactful and proud initiatives, 
                  organized annually in collaboration with local hospitals and blood banks. This large-scale drive 
                  aims to raise awareness about the importance of voluntary blood donation while encouraging students, 
                  faculty, and staff to step forward and contribute to this life-saving cause.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  <p><strong>When:</strong> November 2025</p>
                  <p><strong>Where:</strong> MUJ campus</p>
                  <p><strong>Impact:</strong> 3000+ units collected</p>
                </div>
                <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white transform hover:scale-105 transition-all duration-300">
                  <Link to="/events" className="inline-flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Daan Utsav Card */}
            <Card className="overflow-hidden transition-all hover:shadow-xl border-gray-200 hover:border-rotaract-orange transform hover:scale-105 duration-300">
              <div className="h-48 md:h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop" alt="Daan Utsav" className="w-full h-full object-cover transition-transform hover:scale-110 duration-300" />
              </div>
              <CardContent className="p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-black">Daan Utsav</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  Daan Utsav – The Joy of Giving is our annual celebration of generosity and compassion, 
                  aligned with the nationwide Joy of Giving Week. During this heartwarming event, the Rotaract 
                  Club of MUJ organizes multiple donation drives to collect clothes, books, stationery, toys, 
                  and other essential items.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  <p><strong>When:</strong> October 2025</p>
                  <p><strong>Where:</strong> Multiple Locations</p>
                  <p><strong>Impact:</strong> 500+ beneficiaries</p>
                </div>
                <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white transform hover:scale-105 transition-all duration-300">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* CSD Domain */}
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-rotaract-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:shadow-lg transition-shadow">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">CSD</h3>
              <p className="mb-4">Club Service Domain</p>
              <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white transform hover:scale-105 transition-all duration-300">
                <Link to="/domains?tab=csd">Learn More</Link>
              </Button>
            </div>
            
            {/* CMD Domain */}
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-rotaract-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:shadow-lg transition-shadow">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">CMD</h3>
              <p className="mb-4">Community Service Domain</p>
              <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white transform hover:scale-105 transition-all duration-300">
                <Link to="/domains?tab=cmd">Learn More</Link>
              </Button>
            </div>
            
            {/* ISD Domain */}
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-rotaract-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:shadow-lg transition-shadow">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">ISD</h3>
              <p className="mb-4">International Service Domain</p>
              <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white transform hover:scale-105 transition-all duration-300">
                <Link to="/domains?tab=isd">Learn More</Link>
              </Button>
            </div>
            
            {/* PDD Domain */}
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-rotaract-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:shadow-lg transition-shadow">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">PDD</h3>
              <p className="mb-4">Professional Development Domain</p>
              <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white transform hover:scale-105 transition-all duration-300">
                <Link to="/domains?tab=pdd">Learn More</Link>
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link to="/events" className="inline-flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> View Events
              </Link>
            </Button>
            <Button asChild className="bg-black hover:bg-gray-900 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link to="/team" className="inline-flex items-center">
                <Users className="mr-2 h-4 w-4" /> Meet Our Team
              </Link>
            </Button>
            <Button onClick={handleBecomeMember} variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Users className="mr-2 h-4 w-4" /> Become a Member
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;