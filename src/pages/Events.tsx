
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { eventService } from "@/services/event.service";
import { toast } from "sonner";

interface EventData {
  id: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  domain?: string; // Add domain field for past events
  images: Array<{ id: string; url: string; name: string }>;
  shortDescription: string;
  venue?: string;
  impact?: string;
  bannerUrl?: string;
  galleryUrls?: string[];
  type?: string;
}

const Events = () => {
  const navigate = useNavigate();
  const [storedEvents, setStoredEvents] = useState<EventData[]>([]);
  const [gbmMeetings, setGbmMeetings] = useState<EventData[]>([]);
  
  // Load events from Firebase
  useEffect(() => {
    const loadEventsFromFirebase = async () => {
      try {
        console.log('Events: Loading events from Firebase...');
        const allEvents = await eventService.getCalendarEvents();
        console.log('Events: All events loaded:', allEvents);
        
        // Filter past events and flagship events
        const pastEvents = allEvents.filter(event => 
          (event as any).type === 'past-event' && (event as any).eventCategory === 'past'
        );
        const flagshipEvents = allEvents.filter(event => 
          (event as any).eventCategory === 'flagship'
        );
        
        console.log('Events: All events loaded:', allEvents);
        console.log('Events: Past events filtered:', pastEvents);
        console.log('Events: Flagship events filtered:', flagshipEvents);
        
        // Log individual flagship events to debug banner images
        flagshipEvents.forEach((event, index) => {
          console.log(`Events: Flagship event ${index}:`, {
            id: event.id,
            title: event.title,
            bannerUrl: event.bannerUrl,
            eventCategory: (event as any).eventCategory,
            type: (event as any).type
          });
        });
        
        console.log('Events: Past events:', pastEvents);
        console.log('Events: Flagship events:', flagshipEvents);
        
        setStoredEvents(pastEvents);
        setFirebaseFlagshipEvents(flagshipEvents);
        // Note: GBM meetings are now part of the main calendar, not separate
        setGbmMeetings([]);
      } catch (error) {
        console.error('Events: Error loading events:', error);
        toast.error('Failed to load events');
        setStoredEvents([]);
        setGbmMeetings([]);
      }
    };

    loadEventsFromFirebase();
  }, []);
  
  // State for flagship events from Firebase
  const [firebaseFlagshipEvents, setFirebaseFlagshipEvents] = useState<EventData[]>([]);

  // Demo past events removed - now using Firebase data

  // Combine all events including GBM meetings
  const allPastEvents = [...storedEvents, ...gbmMeetings];

  const handleEventClick = (event: EventData) => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CSD': return 'bg-green-600';
      case 'CMD': return 'bg-blue-600';
      case 'ISD': return 'bg-purple-600';
      case 'PDD': return 'bg-red-600';
      case 'Flagship': return 'bg-rotaract-orange';
      case 'GBM': return 'bg-gray-600';
      case 'Past Event': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const filterEventsByCategory = (events: EventData[], category: string) => {
    return events.filter(event => {
      // Check both category and domain fields for compatibility
      const eventCategory = (event as any).category;
      const eventDomain = (event as any).domain;
      
      return eventCategory === category || 
             eventDomain === category || 
             event.type === category.toLowerCase();
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Events" 
        subtitle="Our flagship events and past event archive" 
        backgroundImage="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=3540&auto=format&fit=crop" 
      />
      
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Flagship Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {firebaseFlagshipEvents.length > 0 ? (
              firebaseFlagshipEvents.map((event) => (
              <Card 
                key={event.id}
                className="overflow-hidden border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleEventClick(event)}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={event.bannerUrl || `https://images.unsplash.com/photo-${
                      event.id && event.id.includes('orientation') ? '1540575467063-178a50c2df87' :
                      event.id && event.id.includes('tree') ? '1488521787991-ed7bbaae773c' :
                      event.id && event.id.includes('cultural') ? '1559223607-a43f990c67bd' :
                      '1528605248644-14dd04022da1'
                    }?q=80&w=3540&auto=format&fit=crop`}
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
            ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No flagship events found. Create some in the admin panel!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Past Events</h2>
          
          <Tabs defaultValue="csd" className="mt-12">
            <TabsList className="grid w-full md:w-[500px] mx-auto grid-cols-4">
              <TabsTrigger value="csd">CSD</TabsTrigger>
              <TabsTrigger value="cmd">CMD</TabsTrigger>
              <TabsTrigger value="isd">ISD</TabsTrigger>
              <TabsTrigger value="pdd">PDD</TabsTrigger>
            </TabsList>
            
            {['csd', 'cmd', 'isd', 'pdd'].map((category) => (
              <TabsContent key={category} value={category} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filterEventsByCategory(allPastEvents, category.toUpperCase()).length > 0 ? (
                    filterEventsByCategory(allPastEvents, category.toUpperCase()).map((event) => (
                      <Card 
                        key={event.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={event.bannerUrl || `https://images.unsplash.com/photo-${
                              event.id && event.id.includes('orientation') ? '1540575467063-178a50c2df87' :
                              event.id && event.id.includes('tree') ? '1488521787991-ed7bbaae773c' :
                              event.id && event.id.includes('cultural') ? '1559223607-a43f990c67bd' :
                              '1528605248644-14dd04022da1'
                            }?q=80&w=3540&auto=format&fit=crop`}
                            alt={event.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <CardContent className="pt-4">
                          {(event.category || event.domain) && (
                            <Badge className={`${getCategoryColor(event.category || event.domain || '')} mb-2`}>
                              {event.category || event.domain}
                            </Badge>
                          )}
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                          <p className="mt-2 text-sm">{event.shortDescription}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-gray-500">No events found for {category.toUpperCase()}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Events;
