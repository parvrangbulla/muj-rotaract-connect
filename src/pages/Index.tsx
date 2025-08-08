import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Heart, Globe, Briefcase, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const Index = () => {
  const handleBecomeMember = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeN_0YXl6S4QJrcTJXSfPk_j0Ev_42DUAh6KPnYbYqzd1hVEA/viewform', '_blank');
  };
  return <div className="min-h-screen bg-background">
      {/* Hero Section - Clean Professional Design */}
      <section className="relative min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-foreground/80" />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-background">
              <div className="mb-8">
                <div className="inline-block px-4 py-2 bg-primary rounded-full text-primary-foreground text-sm font-medium mb-6">
                  Service Above Self
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                  Rotaract Club
                  <span className="block text-primary text-4xl md:text-5xl mt-2">
                    Manipal University Jaipur
                  </span>
                </h1>
                <p className="text-xl text-background/80 mb-8 leading-relaxed">
                  Empowering young leaders to create positive change through professional development, 
                  community service, and global impact initiatives.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link to="/about">Discover Our Mission</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-foreground">
                  <Link to="/events">View Our Events</Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - Logo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 bg-background/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-background/20">
                  <img 
                    src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
                    alt="Rotaract Club MUJ Logo" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-background rounded-lg p-4 shadow-lg">
                  <div className="text-2xl font-bold text-foreground">200+</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-background rounded-lg p-4 shadow-lg">
                  <div className="text-2xl font-bold text-foreground">50+</div>
                  <div className="text-sm text-muted-foreground">Events Annually</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">8+</div>
              <div className="text-sm uppercase tracking-wide">Years of Service</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-sm uppercase tracking-wide">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm uppercase tracking-wide">Annual Events</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm uppercase tracking-wide">Lives Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Leading with Purpose, Serving with Impact
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                As the premier service organization at Manipal University Jaipur, we cultivate the next generation 
                of ethical leaders through meaningful community engagement and professional development.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our commitment extends beyond campus boundaries, creating sustainable solutions for community challenges 
                while fostering global understanding and international cooperation.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/about" className="inline-flex items-center">
                  Learn About Our Values <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1529156066841-6116e61058f4?q=80&w=3432&auto=format&fit=crop" 
                alt="Rotaract members" 
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Events Showcase */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Signature Events & Initiatives
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming communities through meaningful action and sustainable impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Blood Donation Camp */}
            <div className="bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" 
                  alt="Blood Donation Camp" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Annual Event
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Blood Donation Camp</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our flagship healthcare initiative mobilizing the university community for this vital cause, 
                  creating awareness about the life-saving impact of blood donation.
                </p>
                <Button asChild variant="outline">
                  <Link to="/events" className="inline-flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Daan Utsav */}
            <div className="bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop" 
                  alt="Daan Utsav" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Festival of Giving
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Daan Utsav</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  A celebration of generosity bringing our community together to support underprivileged families 
                  through comprehensive donation drives and educational support initiatives.
                </p>
                <Button asChild variant="outline">
                  <Link to="/events" className="inline-flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Domains */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Four Pillars of Excellence
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive service across multiple domains for maximum community impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* CSD */}
            <div className="text-center group hover:bg-muted/50 p-6 rounded-xl transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Club Service</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Internal development, leadership training, and organizational excellence
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* CMD */}
            <div className="text-center group hover:bg-muted/50 p-6 rounded-xl transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Community Service</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Local engagement, sustainable development, and community upliftment
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* ISD */}
            <div className="text-center group hover:bg-muted/50 p-6 rounded-xl transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">International Service</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Global collaboration, cultural exchange, and international partnerships
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
            
            {/* PDD */}
            <div className="text-center group hover:bg-muted/50 p-6 rounded-xl transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Professional Development</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Skill building, career advancement, and professional networking
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link to="/domains">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Join Rotaract Club MUJ and become part of a community dedicated to service, 
            leadership, and positive change that extends far beyond our campus.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <Button 
              onClick={handleBecomeMember} 
              size="lg" 
              className="bg-background text-foreground hover:bg-background/90 flex-1 sm:flex-none"
            >
              <Target className="mr-2 h-5 w-5" />
              Join Our Community
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary flex-1 sm:flex-none">
              <Link to="/events">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Events
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="lg" className="text-primary-foreground hover:bg-primary-foreground/10 flex-1 sm:flex-none">
              <Link to="/team">
                <Users className="mr-2 h-5 w-5" />
                Meet Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;