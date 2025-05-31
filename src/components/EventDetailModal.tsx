
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EventImage {
  id: string;
  url: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  images: EventImage[];
}

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const EventDetailModal = ({ event, isOpen, onClose, isAdmin = false }: EventDetailModalProps) => {
  const [images, setImages] = useState<EventImage[]>(event?.images || []);
  const [uploading, setUploading] = useState(false);

  if (!event) return null;

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    try {
      // Simulate file upload - in real implementation, this would upload to your backend
      const newImages: EventImage[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      
      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {event.category && (
              <Badge className="bg-rotaract-orange">{event.category}</Badge>
            )}
            <span className="text-sm text-gray-500">{event.date}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Event Description</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Photo Gallery */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Photo Gallery</h3>
              {isAdmin && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Images'}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  />
                </div>
              )}
            </div>

            {images.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <p>No images uploaded yet for this event.</p>
                  {isAdmin && (
                    <p className="text-sm mt-2">Upload some images to get started!</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    />
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleImageDelete(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
