
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import EventCalendar from "@/components/EventCalendar";
import EventDetailModal from "@/components/EventDetailModal";
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

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Check if user is admin (you can replace this with your actual auth logic)
  const isAdmin = localStorage.getItem('isLoggedIn') === 'true';

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

  const pastEvents: EventData[] = [
    {
      id: 'orientation-2024',
      title: 'Orientation Session',
      date: 'August 2024',
      shortDescription: 'Welcome session for new members and introduction to Rotaract Club.',
      description: 'A comprehensive orientation session designed to welcome new members to the Rotaract Club family. The session included introduction to Rotaract values, club structure, upcoming events, and networking opportunities for all members.',
      category: 'CSD',
      images: []
    },
    {
      id: 'tree-plantation-2024',
      title: 'Tree Plantation Drive',
      date: 'September 2024',
      shortDescription: 'Environmental initiative to plant trees around campus and nearby areas.',
      description: 'An environmental sustainability initiative where club members participated in planting trees around the campus and nearby community areas. This event aimed to increase green cover and raise awareness about environmental conservation.',
      category: 'CMD',
      images: []
    },
    {
      id: 'cultural-exchange-2024',
      title: 'International Cultural Exchange',
      date: 'November 2024',
      shortDescription: 'Virtual exchange program with Rotaract clubs from other countries.',
      description: 'A virtual cultural exchange program connecting our club with Rotaract clubs from different countries. The event featured cultural presentations, discussions on global issues, and collaborative project planning.',
      category: 'ISD',
      images: []
    },
    {
      id: 'resume-workshop-2025',
      title: 'Resume Building Workshop',
      date: 'January 2025',
      shortDescription: 'Professional development session on building effective resumes.',
      description: 'A comprehensive workshop focused on helping students and young professionals create impactful resumes. The session covered modern resume formats, industry-specific tips, and personal branding strategies.',
      category: 'PDD',
      images: []
    },
    {
      id: 'orphanage-visit-2025',
      title: 'Visit to Orphanage',
      date: 'February 2025',
      shortDescription: 'Visit to local orphanage with donations and activities for children.',
      description: 'A heartwarming visit to a local orphanage where club members organized activities, distributed donations, and spent quality time with the children. The event included games, educational activities, and meal distribution.',
      category: 'CMD',
      images: []
    },
    {
      id: 'annual-meetup-2025',
      title: 'Annual Meetup',
      date: 'March 2025',
      shortDescription: 'Celebration and recognition of achievements throughout the year.',
      description: 'Our annual celebration event recognizing the achievements and contributions of all club members throughout the year. The meetup featured awards ceremony, project showcases, and planning for the upcoming year.',
      category: 'CSD',
      images: []
    }
  ];

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CSD': return 'bg-green-600';
      case 'CMD': return 'bg-blue-600';
      case 'ISD': return 'bg-purple-600';
      case 'PDD': return 'bg-red-600';
      case 'Flagship': return 'bg-rotaract-orange';
      default: return 'bg-gray-600';
    }
  };

  const filterEventsByCategory = (events: EventData[], category: string) => {
    if (category === 'all') return events;
    return events.filter(event => event.category === category);
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
          
          <Tabs defaultValue="all" className="mt-12">
            <TabsList className="grid w-full md:w-[600px] mx-auto grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="csd">CSD</TabsTrigger>
              <TabsTrigger value="cmd">CMD</TabsTrigger>
              <TabsTrigger value="isd">ISD</TabsTrigger>
              <TabsTrigger value="pdd">PDD</TabsTrigger>
            </TabsList>
            
            {['all', 'csd', 'cmd', 'isd', 'pdd'].map((category) => (
              <TabsContent key={category} value={category} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filterEventsByCategory(pastEvents, category.toUpperCase()).map((event) => (
                    <Card 
                      key={event.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${
                            event.id.includes('orientation') ? '1540575467063-178a50c2df87' :
                            event.id.includes('tree') ? '1488521787991-ed7bbaae773c' :
                            event.id.includes('cultural') ? '1559223607-a43f990c67bd' :
                            event.id.includes('resume') ? '1517048676732-d65bc937f952' :
                            event.id.includes('orphanage') ? '1607988795691-3d0147b43231' :
                            '1528605248644-14dd04022da1'
                          }?q=80&w=3540&auto=format&fit=crop`}
                          alt={event.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <CardContent className="pt-4">
                        {event.category && (
                          <Badge className={`${getCategoryColor(event.category)} mb-2`}>
                            {event.category}
                          </Badge>
                        )}
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-gray-500">{event.date}</p>
                        <p className="mt-2 text-sm">{event.shortDescription}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Events;
