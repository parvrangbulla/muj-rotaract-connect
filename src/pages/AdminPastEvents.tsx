import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useLocation } from 'react-router-dom';
import { eventService } from '@/services/event.service';
import { toast } from 'sonner';

interface EventImage {
  id: string;
  url: string;
  name: string;
  isCover?: boolean;
}

interface EventFormData {
  title: string;
  date: string;
  venue: string;
  description: string;
  shortDescription: string;
  category: string;
  domain: string;
  impact?: string;
  bannerUrl?: string;
  galleryUrls: string[];
  images: EventImage[];
}

const AdminPastEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state;

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    venue: '',
    description: '',
    shortDescription: '',
    category: '',
    domain: '',
    impact: '',
    bannerUrl: '',
    galleryUrls: [],
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // Populate form if in edit mode
  useEffect(() => {
    if (editData?.editMode && editData?.eventData) {
      const event = editData.eventData;
      setFormData({
        title: event.title || '',
        date: event.date || '',
        venue: event.venue || '',
        description: event.description || '',
        shortDescription: event.shortDescription || '',
        category: event.category || '',
        domain: event.domain || '',
        impact: event.impact || '',
        bannerUrl: event.bannerUrl || '',
        galleryUrls: event.galleryUrls || [],
        images: event.images || []
      });
    }
  }, [editData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormData(prev => ({ ...prev, bannerUrl: e.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormData(prev => ({
            ...prev,
            galleryUrls: [...prev.galleryUrls, e.target?.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeBanner = () => {
    setBannerFile(null);
    setFormData(prev => ({ ...prev, bannerUrl: '' }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_, i) => i !== index)
    }));
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting event:', formData);
      
      // Create event object for Firebase
      const eventData = {
        title: formData.title,
        description: formData.description,
        type: 'past-event', // Use consistent type for past events
        date: formData.date,
        startTime: '00:00', // Default time for past events
        endTime: '23:59',
        location: formData.venue,
        domain: formData.domain as 'CSD' | 'CMD' | 'ISD' | 'PDD',
        eventCategory: formData.category === 'Flagship' ? 'flagship' : 'past',
        enableRegistration: false, // Past events don't need registration
        enableAttendance: false, // Past events don't need attendance
        createdBy: 'admin', // Will be updated with actual user ID
        createdAt: editData?.editMode ? editData.eventData.createdAt : new Date(),
        updatedAt: new Date(),
        isActive: true,
        showOnGuestCalendar: true,
        bannerUrl: formData.bannerUrl,
        galleryUrls: formData.galleryUrls,
        venue: formData.venue,
        impact: formData.impact,
        shortDescription: formData.shortDescription
      };

      if (editData?.editMode) {
        // Update existing event in Firebase
        console.log('AdminPastEvents: Updating existing event:', editData.eventData.id);
        await eventService.updateEvent(editData.eventData.id, eventData);
        toast.success('Event updated successfully!');
      } else {
        // Create new event in Firebase
        console.log('AdminPastEvents: Creating new event');
        await eventService.createEvent(eventData);
        toast.success('Event created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        date: '',
        venue: '',
        description: '',
        shortDescription: '',
        category: '',
        domain: '',
        impact: '',
        bannerUrl: '',
        galleryUrls: [],
        images: []
      });
      setBannerFile(null);
      setGalleryFiles([]);

      navigate(-1);
      
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            {editData?.editMode ? 'Edit Event' : 'Create Past Event'}
          </h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Event Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flagship">Flagship Event</SelectItem>
                    <SelectItem value="Past Event">Past Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Domain - Only show for Past Events */}
              {formData.category === 'Past Event' && (
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select value={formData.domain} onValueChange={(value) => handleInputChange('domain', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSD">CSD (Community Service Director)</SelectItem>
                      <SelectItem value="CMD">CMD (Club Membership Director)</SelectItem>
                      <SelectItem value="ISD">ISD (International Service Director)</SelectItem>
                      <SelectItem value="PDD">PDD (Professional Development Director)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Date and Venue Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="Event location/venue"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Impact - Only for flagship events */}
              {formData.category === 'Flagship' && (
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact</Label>
                  <Input
                    id="impact"
                    value={formData.impact || ''}
                    onChange={(e) => handleInputChange('impact', e.target.value)}
                    placeholder="e.g., 300+ donations, 1000+ beneficiaries"
                  />
                </div>
              )}

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Brief description for event cards"
                  rows={3}
                  required
                />
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed event description"
                  rows={5}
                  required
                />
              </div>

              {/* Banner Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="banner">Event Banner Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {formData.bannerUrl ? (
                    <div className="relative">
                      <img
                        src={formData.bannerUrl}
                        alt="Banner preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeBanner}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Input
                          id="banner"
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('banner')?.click()}
                        >
                          Upload Banner Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images Upload */}
              <div className="space-y-2">
                <Label htmlFor="gallery">Gallery Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Input
                        id="gallery"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('gallery')?.click()}
                      >
                        Upload Gallery Images
                      </Button>
                    </div>
                  </div>
                  
                  {formData.galleryUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {formData.galleryUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (editData?.editMode ? 'Updating Event...' : 'Creating Event...') 
                  : (editData?.editMode ? 'Update Event' : 'Create Event')
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPastEvents;
