import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  // Get all images for the lightbox
  const getAllImages = () => {
    const images: string[] = [];
    
    // Add banner image if available
    if (event?.bannerUrl) {
      images.push(event.bannerUrl);
    }
    
    // Add gallery images
    if (event?.galleryUrls) {
      images.push(...event.galleryUrls);
    }
    
    // Add legacy images
    if (event?.images) {
      images.push(...event.images.map(img => img.url));
    }
    
    return images;
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    const images = getAllImages();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    const images = getAllImages();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (lightboxOpen) {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, selectedImageIndex]);

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

  const allImages = getAllImages();

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
        <div className="mb-8 h-96 overflow-hidden rounded-lg shadow-lg relative group cursor-pointer" onClick={() => openLightbox(0)}>
          <img 
            src={event.bannerUrl || (event.id === 'bdc-2024' 
              ? "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" 
              : event.id === 'daan-utsav-2024'
              ? "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop"
              : `https://images.unsplash.com/photo-${
                  event.id && event.id.includes('orientation') ? '1540575467063-178a50c2df87' :
                  event.id && event.id.includes('tree') ? '1488521787991-ed7bbaae773c' :
                  event.id && event.id.includes('cultural') ? '1559223607-a43f990c67bd' :
                  event.id && event.id.includes('resume') ? '1517048676732-d65bc937f952' :
                  event.id && event.id.includes('orphanage') ? '1607988795691-3d0147b43231' :
                  '1528605248644-14dd04022da1'
                }?q=80&w=3540&auto=format&fit=crop`
            )}
            alt={event.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
              <ZoomIn className="w-6 h-6 text-gray-800" />
            </div>
          </div>
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

          {/* Enhanced Photo Gallery */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Photo Gallery</h3>
                {allImages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No images uploaded yet for this event.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {allImages.map((imageUrl, index) => (
                      <div 
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover transition-transform group-hover:scale-110"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                            <ZoomIn className="w-4 h-4 text-gray-800" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Gallery Info */}
                {allImages.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Click on any image to view in full size
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Use arrow keys or click navigation to browse
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Main Image */}
            <img
              src={allImages[selectedImageIndex]}
              alt={`Gallery ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} of {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
