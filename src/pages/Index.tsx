import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Heart, Globe, Briefcase, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const Index = () => {
  const handleBecomeMember = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeN_0YXl6S4QJrcTJXSfPk_j0Ev_42DUAh6KPnYbYqzd1hVEA/viewform', '_blank');
  };
  return <div className="min-h-screen bg-background">
      {/* Hero Section - Modern Typography Layout */}
      <section className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        
        {/* Large Typography Display */}
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Typography Grid - Inspired by LITMUS */}
          <div className="mb-12">
            <div className="grid grid-cols-8 gap-1 max-w-2xl mx-auto mb-8">
              {['R','O','T','A','R','A','C','T'].map((letter, i) => (
                <div key={i} className={`
                  aspect-square flex items-center justify-center text-2xl md:text-4xl font-bold
                  ${i === 3 || i === 6 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}
                  hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer
                  animate-fade-up
                `} style={{ animationDelay: `${i * 100}ms` }}>
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
              alt="Rotaract Club MUJ Logo" 
              className="w-32 h-32 mx-auto object-contain animate-fade-up" 
              style={{ animationDelay: '800ms' }}
            />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 animate-fade-up" style={{ animationDelay: '900ms' }}>
            ROTARACT
          </h1>
          <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6 animate-fade-up" style={{ animationDelay: '1000ms' }}>
            The Official Service Club of Manipal University Jaipur
          </h2>
          
          {/* Tagline */}
          <div className="mb-12 animate-fade-up" style={{ animationDelay: '1100ms' }}>
            <p className="text-lg md:text-xl text-muted-foreground italic">
              "Service Above Self"
            </p>
            <div className="w-24 h-1 bg-primary mx-auto mt-4" />
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '1200ms' }}>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/about">Discover Our Mission</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/events">Explore Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              ABOUT • ROTARACT • MUJ
            </h2>
            <div className="w-32 h-1 bg-primary mx-auto mb-12" />
            
            <div className="text-lg md:text-xl text-muted-foreground leading-relaxed space-y-6">
              <p>
                Rotaract Club of Manipal University Jaipur stands as a beacon of service, 
                leadership, and professional excellence within our academic community.
              </p>
              <p>
                As proud members of Rotary International, we embody the spirit of "Service Above Self," 
                fostering meaningful connections while creating lasting impact through our initiatives.
              </p>
            </div>
            
            <div className="mt-12">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/about" className="inline-flex items-center">
                  Our Story <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              FEATURED • EVENTS
            </h2>
            <div className="w-32 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our signature initiatives that drive meaningful change in our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Blood Donation Camp */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-6 h-80">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" 
                  alt="Blood Donation Camp" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-sm font-medium mb-2 text-primary">ANNUAL • EVENT</div>
                  <h3 className="text-3xl font-bold">Blood Donation Camp</h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our flagship Blood Donation Camp mobilizes the university community to contribute to this life-saving cause, 
                fostering awareness about the critical importance of blood donation in healthcare.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link to="/events" className="inline-flex items-center">
                  Explore Event <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Daan Utsav */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-6 h-80">
                <img 
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop" 
                  alt="Daan Utsav" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-sm font-medium mb-2 text-primary">FESTIVAL • OF • GIVING</div>
                  <h3 className="text-3xl font-bold">Daan Utsav</h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                A celebration of generosity where our community comes together to support underprivileged families 
                through comprehensive donation drives encompassing essential supplies and educational resources.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link to="/events" className="inline-flex items-center">
                  Explore Event <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Domains Section */}
      <section className="py-20 md:py-32 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              SERVICE • DOMAINS
            </h2>
            <div className="w-32 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-background/80 max-w-2xl mx-auto">
              Four pillars of excellence that define our commitment to comprehensive service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Club Service Domain */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">CSD</h3>
              <h4 className="text-lg font-medium mb-4 text-background/90">Club Service Domain</h4>
              <p className="text-sm text-background/70 mb-6 leading-relaxed">
                Strengthening our internal framework through leadership development and organizational excellence
              </p>
              <Button asChild variant="outline" size="sm" className="border-background text-background hover:bg-background hover:text-foreground">
                <Link to="/domains">Explore</Link>
              </Button>
            </div>
            
            {/* Community Service Domain */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">CMD</h3>
              <h4 className="text-lg font-medium mb-4 text-background/90">Community Service Domain</h4>
              <p className="text-sm text-background/70 mb-6 leading-relaxed">
                Creating lasting impact through local community engagement and sustainable development initiatives
              </p>
              <Button asChild variant="outline" size="sm" className="border-background text-background hover:bg-background hover:text-foreground">
                <Link to="/domains">Explore</Link>
              </Button>
            </div>
            
            {/* International Service Domain */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">ISD</h3>
              <h4 className="text-lg font-medium mb-4 text-background/90">International Service Domain</h4>
              <p className="text-sm text-background/70 mb-6 leading-relaxed">
                Fostering global understanding through cross-cultural collaboration and international partnerships
              </p>
              <Button asChild variant="outline" size="sm" className="border-background text-background hover:bg-background hover:text-foreground">
                <Link to="/domains">Explore</Link>
              </Button>
            </div>
            
            {/* Professional Development Domain */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">PDD</h3>
              <h4 className="text-lg font-medium mb-4 text-background/90">Professional Development Domain</h4>
              <p className="text-sm text-background/70 mb-6 leading-relaxed">
                Empowering members with essential skills and career advancement opportunities for future success
              </p>
              <Button asChild variant="outline" size="sm" className="border-background text-background hover:bg-background hover:text-foreground">
                <Link to="/domains">Explore</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              JOIN • THE • MOVEMENT
            </h2>
            <div className="w-32 h-1 bg-primary mx-auto mb-12" />
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Become part of a legacy that transforms communities, develops leaders, 
              and creates lasting positive change across our university and beyond.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button asChild size="lg" className="h-16 text-lg">
                <Link to="/events" className="flex items-center justify-center">
                  <Calendar className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Upcoming Events</div>
                    <div className="text-sm opacity-80">Discover opportunities</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="h-16 text-lg">
                <Link to="/team" className="flex items-center justify-center">
                  <Users className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Our Leadership</div>
                    <div className="text-sm opacity-80">Meet the team</div>
                  </div>
                </Link>
              </Button>
              
              <Button onClick={handleBecomeMember} variant="default" size="lg" className="h-16 text-lg bg-primary hover:bg-primary/90">
                <Target className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Join Rotaract</div>
                  <div className="text-sm opacity-80">Start your journey</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;