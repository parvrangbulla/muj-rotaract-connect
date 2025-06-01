import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

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
  bannerUrl?: string;
  galleryUrls?: string[];
}

const EventDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<EventData | null>(location.state?.event || null);

  useEffect(() => {
    if (!event && id) {
      // Try to find the event in stored events
      const storedEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      const foundEvent = storedEvents.find((e: EventData) => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      }
    }
  }, [id, event]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
          <Button onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/events')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-800">{event.title}</h1>
            {event.category && (
              <Badge className={`${getCategoryColor(event.category)} text-white`}>
                {event.category}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
            <div>
              <span className="font-semibold">Date: </span>
              <span>{formatDate(event.date)}</span>
            </div>
            {event.venue && (
              <div>
                <span className="font-semibold">Venue: </span>
                <span>{event.venue}</span>
              </div>
            )}
            {event.impact && (
              <div>
                <span className="font-semibold">Impact: </span>
                <span>{event.impact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-8 h-96 overflow-hidden rounded-lg shadow-lg">
          <img 
            src={event.bannerUrl || (event.id === 'bdc-2024' 
              ? "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" 
              : event.id === 'daan-utsav-2024'
              ? "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop"
              : `https://images.unsplash.com/photo-${
                  event.id.includes('orientation') ? '1540575467063-178a50c2df87' :
                  event.id.includes('tree') ? '1488521787991-ed7bbaae773c' :
                  event.id.includes('cultural') ? '1559223607-a43f990c67bd' :
                  event.id.includes('resume') ? '1517048676732-d65bc937f952' :
                  event.id.includes('orphanage') ? '1607988795691-3d0147b43231' :
                  '1528605248644-14dd04022da1'
                }?q=80&w=3540&auto=format&fit=crop`
            )}
            alt={event.title} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Description */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Photo Gallery */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Photo Gallery</h3>
                {(!event.galleryUrls || event.galleryUrls.length === 0) && (!event.images || event.images.length === 0) ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No images uploaded yet for this event.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Display gallery URLs for stored events */}
                    {event.galleryUrls?.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      />
                    ))}
                    {/* Display traditional images for legacy events */}
                    {event.images?.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
