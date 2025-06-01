import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventData {
  id: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  images: Array<{ id: string; url: string; name: string }>;
  shortDescription: string;
  venue?: string;
  impact?: string;
}

interface PastEvent {
  id: string;
  title: string;
  description: string;
  domain: 'CMD' | 'CSD' | 'PDD' | 'ISD';
  date: Date;
  bannerPhoto: string;
  galleryImages: string[];
}

const Events = () => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Sample data - replace with your actual data source
  const flagshipEvents: EventData[] = [
    {
      id: 'bdc-2024',
      title: 'Blood Donation Camp (BDC)',
      date: 'July 2024',
      shortDescription: 'Our annual Blood Donation Camp encourages students and faculty to donate blood and raise awareness about the importance of blood donation in saving lives.',
      description: 'Our annual Blood Donation Camp is one of our most impactful events where we partner with local hospitals and blood banks to organize a large-scale donation drive on campus. The event aims to raise awareness about the importance of blood donation and encourage students, faculty, and staff to contribute to this life-saving cause.',
      category: 'Flagship',
      venue: 'MUJ Campus',
      impact: '300+ donations annually',
      images: []
    },
    {
      id: 'daan-utsav-2024',
      title: 'Daan Utsav',
      date: 'October 2024',
      shortDescription: 'Daan Utsav is our festival of giving where we organize donation drives to help the underprivileged communities with clothes, books, food, and other essential items.',
      description: 'Daan Utsav (Festival of Giving) is our annual contribution to the joy of giving week celebrated across India. During this event, we organize various donation drives to collect clothes, books, stationery, and other essential items. These donated items are then distributed to underprivileged communities, orphanages, and schools in and around Jaipur, bringing smiles to hundreds of faces.',
      category: 'Flagship',
      venue: 'Multiple locations',
      impact: '1000+ beneficiaries annually',
      images: []
    }
  ];

  useEffect(() => {
    // Load past events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
    setPastEvents(storedEvents.map((event: any) => ({
      ...event,
      date: new Date(event.date)
    })));
  }, []);

  const handleEventClick = (event: EventData) => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  const handlePastEventClick = (event: PastEvent) => {
    navigate(`/event/${event.id}`, { state: { pastEvent: event } });
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'CSD': return 'bg-green-600';
      case 'CMD': return 'bg-blue-600';
      case 'ISD': return 'bg-purple-600';
      case 'PDD': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const filterEventsByDomain = (domain: string) => {
    if (domain === 'all') return pastEvents;
    return pastEvents.filter(event => event.domain === domain);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Events" 
        subtitle="Annual event calendar and flagship events" 
        backgroundImage="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=3540&auto=format&fit=crop" 
      />
      
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Flagship Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {flagshipEvents.map((event) => (
              <Card 
                key={event.id}
                className="overflow-hidden border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleEventClick(event)}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={event.id === 'bdc-2024' 
                      ? "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" 
                      : "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop"
                    } 
                    alt={event.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{event.title}</CardTitle>
                      <CardDescription>{event.category} Event</CardDescription>
                    </div>
                    <Badge className="bg-rotaract-orange">Flagship</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{event.shortDescription}</p>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center">
                      <span className="font-semibold w-24">When:</span>
                      <span>{event.date}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center">
                        <span className="font-semibold w-24">Where:</span>
                        <span>{event.venue}</span>
                      </div>
                    )}
                    {event.impact && (
                      <div className="flex items-center">
                        <span className="font-semibold w-24">Impact:</span>
                        <span>{event.impact}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Past Events</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-12">
            <TabsList className="grid w-full md:w-[500px] mx-auto grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="CMD">CMD</TabsTrigger>
              <TabsTrigger value="CSD">CSD</TabsTrigger>
              <TabsTrigger value="PDD">PDD</TabsTrigger>
              <TabsTrigger value="ISD">ISD</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filterEventsByDomain(activeTab).length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No events found for this domain.</p>
                  </div>
                ) : (
                  filterEventsByDomain(activeTab).map((event) => (
                    <Card 
                      key={event.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                      onClick={() => handlePastEventClick(event)}
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={event.bannerPhoto || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop"}
                          alt={event.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <CardContent className="pt-4">
                        <Badge className={`${getDomainColor(event.domain)} mb-2`}>
                          {event.domain}
                        </Badge>
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{formatDate(event.date)}</p>
                        <p className="text-sm text-gray-700 line-clamp-3">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Events;
