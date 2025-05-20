
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="min-h-screen relative flex items-center justify-center bg-black"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=3540&auto=format&fit=crop')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="container mx-auto px-4 text-center text-white z-10">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
              alt="Rotaract Club MUJ Logo" 
              className="w-32 h-32 object-contain animate-fade-in"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-up">
            Rotaract Club
          </h1>
          <h2 className="text-2xl md:text-4xl font-medium mb-6 animate-fade-up" style={{animationDelay: '200ms'}}>
            Manipal University Jaipur
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up" style={{animationDelay: '400ms'}}>
            Service Above Self
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-up" style={{animationDelay: '600ms'}}>
            <Button asChild className="bg-rotaract-orange hover:bg-orange-600 text-white">
              <Link to="/about">About Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Link to="/events">Our Events</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">About Rotaract MUJ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-6">
                Rotaract Club of Manipal University Jaipur is a dynamic organization
                dedicated to professional development and community service.
                As part of Rotary International, we strive to make a positive impact
                on our campus and in the local community.
              </p>
              <p className="text-lg mb-6">
                Our members develop leadership skills, engage in meaningful service
                projects, and build a network of friends and professionals who share
                a vision of creating positive change.
              </p>
              <Button asChild className="bg-rotaract-orange hover:bg-orange-600 text-white">
                <Link to="/about" className="inline-flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=3432&auto=format&fit=crop" 
                alt="Rotaract members" 
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Events Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Flagship Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Blood Donation Camp Card */}
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" 
                  alt="Blood Donation Camp" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Blood Donation Camp (BDC)</h3>
                <p className="text-gray-700 mb-4">
                  Our annual Blood Donation Camp encourages students and faculty to donate blood and
                  raise awareness about the importance of blood donation in saving lives.
                </p>
                <Button asChild className="bg-rotaract-orange hover:bg-orange-600 text-white">
                  <Link to="/events" className="inline-flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Daan Utsav Card */}
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop" 
                  alt="Daan Utsav" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Daan Utsav</h3>
                <p className="text-gray-700 mb-4">
                  Daan Utsav is our festival of giving where we organize donation
                  drives to help the underprivileged communities with clothes, books,
                  food, and other essential items.
                </p>
                <Button asChild className="bg-rotaract-orange hover:bg-orange-600 text-white">
                  <Link to="/events" className="inline-flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Domains Quick Links */}
      <section className="py-16 md:py-24 bg-rotaract-orange text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Domains</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* CSD Domain */}
            <div className="text-center">
              <div className="bg-white text-rotaract-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">CSD</h3>
              <p className="mb-4">Club Service Domain</p>
              <Button asChild variant="outline" className="border-white hover:bg-white hover:text-rotaract-orange">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* CMD Domain */}
            <div className="text-center">
              <div className="bg-white text-rotaract-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">CMD</h3>
              <p className="mb-4">Community Service Domain</p>
              <Button asChild variant="outline" className="border-white hover:bg-white hover:text-rotaract-orange">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* ISD Domain */}
            <div className="text-center">
              <div className="bg-white text-rotaract-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">ISD</h3>
              <p className="mb-4">International Service Domain</p>
              <Button asChild variant="outline" className="border-white hover:bg-white hover:text-rotaract-orange">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* PDD Domain */}
            <div className="text-center">
              <div className="bg-white text-rotaract-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">PDD</h3>
              <p className="mb-4">Professional Development Domain</p>
              <Button asChild variant="outline" className="border-white hover:bg-white hover:text-rotaract-orange">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Explore More About Rotaract MUJ</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Check out our events, meet our team, and learn more about how you can get involved
            with Rotaract Club at Manipal University Jaipur.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="bg-rotaract-orange hover:bg-orange-600 text-white">
              <Link to="/events" className="inline-flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> View Events
              </Link>
            </Button>
            <Button asChild className="bg-black hover:bg-gray-800 text-white">
              <Link to="/team" className="inline-flex items-center">
                <Users className="mr-2 h-4 w-4" /> Meet Our Team
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white">
              <Link to="/gallery" className="inline-flex items-center">
                <Image className="mr-2 h-4 w-4" /> Photo Gallery
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
