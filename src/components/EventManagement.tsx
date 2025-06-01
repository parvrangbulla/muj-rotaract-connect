
import { useState } from 'react';
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
}

const EventManagement = () => {
  const navigate = useNavigate();
  
  // Sample events data - in real app, this would come from your data source
  const [flagshipEvents, setFlagshipEvents] = useState<EventData[]>([
    {
      id: 'bdc-2024',
      title: 'Blood Donation Camp (BDC)',
      date: 'July 2024',
      shortDescription: 'Our annual Blood Donation Camp encourages students and faculty to donate blood.',
      description: 'Our annual Blood Donation Camp is one of our most impactful events.',
      category: 'Flagship',
      venue: 'MUJ Campus',
      impact: '300+ donations annually',
      images: []
    },
    {
      id: 'daan-utsav-2024',
      title: 'Daan Utsav',
      date: 'October 2024',
      shortDescription: 'Daan Utsav is our festival of giving.',
      description: 'Daan Utsav (Festival of Giving) is our annual contribution.',
      category: 'Flagship',
      venue: 'Multiple locations',
      impact: '1000+ beneficiaries annually',
      images: []
    }
  ]);

  const [pastEvents, setPastEvents] = useState<EventData[]>([
    {
      id: 'orientation-2024',
      title: 'Orientation Session',
      date: 'August 2024',
      shortDescription: 'Welcome session for new members.',
      description: 'A comprehensive orientation session.',
      category: 'CSD',
      images: []
    },
    {
      id: 'tree-plantation-2024',
      title: 'Tree Plantation Drive',
      date: 'September 2024',
      shortDescription: 'Environmental initiative to plant trees.',
      description: 'An environmental sustainability initiative.',
      category: 'CMD',
      images: []
    }
  ]);

  const handleEditEvent = (eventId: string) => {
    // Navigate to edit form with event data
    console.log('Editing event:', eventId);
    // In a real implementation, you would navigate to an edit form
    alert(`Edit functionality for event ${eventId} would open here`);
  };

  const handleDeleteEvent = (eventId: string, eventType: 'flagship' | 'past') => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      if (eventType === 'flagship') {
        setFlagshipEvents(prev => prev.filter(event => event.id !== eventId));
      } else {
        setPastEvents(prev => prev.filter(event => event.id !== eventId));
      }
      
      // Also remove from localStorage if it exists
      const storedEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      const updatedEvents = storedEvents.filter((event: any) => event.id !== eventId);
      localStorage.setItem('pastEvents', JSON.stringify(updatedEvents));
      
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
          {event.category && (
            <Badge className="bg-rotaract-orange">{event.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">{event.shortDescription}</p>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditEvent(event.id)}
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
          {event.images.length > 0 && (
            <div className="text-sm text-gray-500">
              📸 {event.images.length} image{event.images.length !== 1 ? 's' : ''} uploaded
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Past Events Management</h2>
          <p className="text-gray-600">Create, edit, and manage events</p>
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
