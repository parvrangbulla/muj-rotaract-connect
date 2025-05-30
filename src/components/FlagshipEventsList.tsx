
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface EventImage {
  id: string;
  url: string;
  name: string;
}

interface FlagshipEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  images: EventImage[];
}

const FlagshipEventsList = () => {
  const [events] = useState<FlagshipEvent[]>([
    {
      id: '1',
      title: 'Daan Utsav',
      date: '2024-09-05',
      description: 'A week-long festival of giving where we organized donation drives for clothes, books, and essential items for underprivileged communities.',
      images: []
    },
    {
      id: '2',
      title: 'Blood Donation Camp (BDC)',
      date: '2024-10-07',
      description: 'Our annual flagship blood donation camp that successfully collected 200+ units of blood, helping save countless lives.',
      images: []
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState<FlagshipEvent | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [eventImages, setEventImages] = useState<EventImage[]>([]);

  const handleEventClick = (event: FlagshipEvent) => {
    setSelectedEvent(event);
    setEventImages(event.images);
    setIsEventOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newImage: EventImage = {
              id: Date.now().toString(),
              url: e.target?.result as string,
              name: file.name
            };
            setEventImages(prev => [...prev, newImage]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (imageId: string) => {
    setEventImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Flagship Events</h2>
        <p className="text-gray-600">Our signature events that define our club's mission and impact</p>
      </div>

      <div className="grid gap-6">
        {events.map(event => (
          <Card key={event.id} className="cursor-pointer hover:shadow-lg transition-shadow border-rotaract-orange/20" onClick={() => handleEventClick(event)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-rotaract-orange">{event.title}</CardTitle>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Detail Modal */}
      <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-rotaract-orange">{selectedEvent.title}</DialogTitle>
                <p className="text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()}</p>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">About This Event</h3>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Event Gallery</h3>
                    <div>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="flagship-image-upload"
                      />
                      <Button
                        onClick={() => document.getElementById('flagship-image-upload')?.click()}
                        variant="outline"
                        size="sm"
                        className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  </div>

                  {eventImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {eventImages.map(image => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            onClick={() => removeImage(image.id)}
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-rotaract-orange/30 rounded-lg">
                      <p className="text-gray-500">No images uploaded yet. Click "Upload Images" to add photos from this flagship event.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlagshipEventsList;
