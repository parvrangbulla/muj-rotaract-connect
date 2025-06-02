
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

interface EventImage {
  id: string;
  url: string;
  name: string;
  isCover?: boolean;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  images: EventImage[];
  shortDescription: string;
  venue?: string;
  impact?: string;
  eventType?: 'past' | 'flagship';
  domain?: string;
  bannerUrl?: string;
  galleryUrls?: string[];
}

const EventManagement = () => {
  const navigate = useNavigate();
  
  const [flagshipEvents, setFlagshipEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);

  // Load events from localStorage
  useEffect(() => {
    const loadEvents = () => {
      // Load flagship events
      const storedFlagship = JSON.parse(localStorage.getItem('flagshipEvents') || '[]');
      const defaultFlagship = [
        {
          id: 'bdc-2024',
          title: 'Blood Donation Camp (BDC)',
          date: 'July 2024',
          shortDescription: 'Our annual Blood Donation Camp encourages students and faculty to donate blood.',
          description: 'Our annual Blood Donation Camp is one of our most impactful events.',
          category: 'Flagship',
          eventType: 'flagship' as const,
          venue: 'MUJ Campus',
          impact: '300+ donations annually',
          images: [],
          bannerUrl: '',
          galleryUrls: []
        },
        {
          id: 'daan-utsav-2024',
          title: 'Daan Utsav',
          date: 'October 2024',
          shortDescription: 'Daan Utsav is our festival of giving.',
          description: 'Daan Utsav (Festival of Giving) is our annual contribution.',
          category: 'Flagship',
          eventType: 'flagship' as const,
          venue: 'Multiple locations',
          impact: '1000+ beneficiaries annually',
          images: [],
          bannerUrl: '',
          galleryUrls: []
        }
      ];
      setFlagshipEvents([...defaultFlagship, ...storedFlagship]);

      // Load past events
      const storedPast = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      const defaultPast = [
        {
          id: 'orientation-2024',
          title: 'Orientation Session',
          date: 'August 2024',
          shortDescription: 'Welcome session for new members.',
          description: 'A comprehensive orientation session.',
          category: 'CSD',
          eventType: 'past' as const,
          domain: 'CSD',
          images: [],
          bannerUrl: '',
          galleryUrls: []
        },
        {
          id: 'tree-plantation-2024',
          title: 'Tree Plantation Drive',
          date: 'September 2024',
          shortDescription: 'Environmental initiative to plant trees.',
          description: 'An environmental sustainability initiative.',
          category: 'CMD',
          eventType: 'past' as const,
          domain: 'CMD',
          images: [],
          bannerUrl: '',
          galleryUrls: []
        }
      ];
      setPastEvents([...defaultPast, ...storedPast]);
    };

    loadEvents();

    // Listen for storage changes
    const handleStorageChange = () => loadEvents();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleEditEvent = (eventId: string, eventType: 'flagship' | 'past') => {
    // Find the event to edit
    const allEvents = eventType === 'flagship' ? flagshipEvents : pastEvents;
    const eventToEdit = allEvents.find(event => event.id === eventId);
    
    if (eventToEdit) {
      // Navigate to edit form with pre-filled data
      navigate('/admin/past-events', { 
        state: { 
          editMode: true, 
          eventData: eventToEdit,
          eventType 
        } 
      });
    }
  };

  const handleDeleteEvent = (eventId: string, eventType: 'flagship' | 'past') => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      if (eventType === 'flagship') {
        const updatedFlagship = flagshipEvents.filter(event => event.id !== eventId);
        setFlagshipEvents(updatedFlagship);
        
        // Update localStorage (only for non-default events)
        const storedFlagship = JSON.parse(localStorage.getItem('flagshipEvents') || '[]');
        const updatedStoredFlagship = storedFlagship.filter((event: any) => event.id !== eventId);
        localStorage.setItem('flagshipEvents', JSON.stringify(updatedStoredFlagship));
      } else {
        const updatedPast = pastEvents.filter(event => event.id !== eventId);
        setPastEvents(updatedPast);
        
        // Update localStorage (only for non-default events)
        const storedPast = JSON.parse(localStorage.getItem('pastEvents') || '[]');
        const updatedStoredPast = storedPast.filter((event: any) => event.id !== eventId);
        localStorage.setItem('pastEvents', JSON.stringify(updatedStoredPast));
      }
      
      alert('Event deleted successfully!');
    }
  };

  const renderEventCard = (event: EventData, eventType: 'flagship' | 'past') => (
    <Card key={event.id} className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <p className="text-sm text-gray-500">{event.date}</p>
          </div>
          <div className="flex gap-2">
            {event.category && (
              <Badge className="bg-rotaract-orange">{event.category}</Badge>
            )}
            {event.domain && event.domain !== event.category && (
              <Badge variant="outline">{event.domain}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">{event.shortDescription}</p>
          
          {/* Banner Image Preview */}
          {event.bannerUrl && (
            <div className="h-32 w-full overflow-hidden rounded-lg">
              <img 
                src={event.bannerUrl} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditEvent(event.id, eventType)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Event
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteEvent(event.id, eventType)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Delete Event
            </Button>
          </div>

          {/* Show uploaded images count if any */}
          {((event.galleryUrls && event.galleryUrls.length > 0) || (event.images && event.images.length > 0)) && (
            <div className="text-sm text-gray-500">
              📸 {(event.galleryUrls?.length || 0) + (event.images?.length || 0)} image{((event.galleryUrls?.length || 0) + (event.images?.length || 0)) !== 1 ? 's' : ''} uploaded
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Event Management</h2>
          <p className="text-gray-600">Create, edit, and manage all events</p>
        </div>
        <Button
          onClick={() => navigate('/admin/past-events')}
          className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Event
        </Button>
      </div>

      <Tabs defaultValue="past" className="space-y-6">
        <TabsList>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="flagship">Flagship Events</TabsTrigger>
        </TabsList>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <p>No past events found.</p>
                  <Button
                    onClick={() => navigate('/admin/past-events')}
                    className="mt-4 bg-rotaract-orange hover:bg-rotaract-orange/90"
                  >
                    Create Your First Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            pastEvents.map((event) => renderEventCard(event, 'past'))
          )}
        </TabsContent>

        <TabsContent value="flagship" className="space-y-4">
          {flagshipEvents.map((event) => renderEventCard(event, 'flagship'))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventManagement;
