import { useState } from 'react';
import { Upload, Trash2, Star, Plus } from 'lucide-react';
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

  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (eventId: string, files: FileList, eventType: 'flagship' | 'past') => {
    setUploading(eventId);
    try {
      // Simulate file upload - in real implementation, this would upload to your backend
      const newImages: EventImage[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        name: file.name,
        isCover: false
      }));

      if (eventType === 'flagship') {
        setFlagshipEvents(prev => 
          prev.map(event => 
            event.id === eventId 
              ? { ...event, images: [...event.images, ...newImages] }
              : event
          )
        );
      } else {
        setPastEvents(prev => 
          prev.map(event => 
            event.id === eventId 
              ? { ...event, images: [...event.images, ...newImages] }
              : event
          )
        );
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(null);
    }
  };

  const handleImageDelete = (eventId: string, imageId: string, eventType: 'flagship' | 'past') => {
    if (eventType === 'flagship') {
      setFlagshipEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, images: event.images.filter(img => img.id !== imageId) }
            : event
        )
      );
    } else {
      setPastEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, images: event.images.filter(img => img.id !== imageId) }
            : event
        )
      );
    }
  };

  const handleSetCoverImage = (eventId: string, imageId: string, eventType: 'flagship' | 'past') => {
    if (eventType === 'flagship') {
      setFlagshipEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                images: event.images.map(img => ({ 
                  ...img, 
                  isCover: img.id === imageId 
                })) 
              }
            : event
        )
      );
    } else {
      setPastEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                images: event.images.map(img => ({ 
                  ...img, 
                  isCover: img.id === imageId 
                })) 
              }
            : event
        )
      );
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
          {/* Upload Section */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={uploading === event.id}
              onClick={() => document.getElementById(`upload-${event.id}`)?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading === event.id ? 'Uploading...' : 'Upload Images'}
            </Button>
            <input
              id={`upload-${event.id}`}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleImageUpload(event.id, e.target.files, eventType)}
            />
          </div>

          {/* Images Grid */}
          {event.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {event.images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className={`w-full h-24 object-cover rounded shadow-sm ${
                      image.isCover ? 'ring-2 ring-rotaract-orange' : ''
                    }`}
                  />
                  {image.isCover && (
                    <div className="absolute top-1 left-1">
                      <Star className="w-4 h-4 text-rotaract-orange fill-current" />
                    </div>
                  )}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="p-1 h-6 w-6"
                      onClick={() => handleSetCoverImage(event.id, image.id, eventType)}
                      title="Set as cover image"
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="p-1 h-6 w-6"
                      onClick={() => handleImageDelete(event.id, image.id, eventType)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
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
          <p className="text-gray-600">Upload and manage images for events</p>
        </div>
        <Button
          onClick={() => navigate('/admin/past-events')}
          className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Event
        </Button>
      </div>

      <Tabs defaultValue="flagship" className="space-y-6">
        <TabsList>
          <TabsTrigger value="flagship">Flagship Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="flagship" className="space-y-4">
          {flagshipEvents.map((event) => renderEventCard(event, 'flagship'))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.map((event) => renderEventCard(event, 'past'))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventManagement;
