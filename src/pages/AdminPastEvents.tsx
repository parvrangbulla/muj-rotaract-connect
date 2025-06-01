
import { useState } from 'react';
import { ArrowLeft, Upload, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface PastEventFormData {
  title: string;
  description: string;
  domain: string;
  date: string;
  bannerPhoto: File | null;
  galleryImages: File[];
}

const AdminPastEvents = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PastEventFormData>({
    title: '',
    description: '',
    domain: '',
    date: '',
    bannerPhoto: null,
    galleryImages: []
  });
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, bannerPhoto: file }));
      const reader = new FileReader();
      reader.onload = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ 
      ...prev, 
      galleryImages: [...prev.galleryImages, ...files] 
    }));
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, you would upload files and save to database
      // For now, we'll simulate the process
      console.log('Submitting event:', formData);
      
      // Create event object with mock URLs
      const newEvent = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        date: formData.date,
        bannerUrl: bannerPreview || '',
        galleryUrls: galleryPreviews,
        shortDescription: formData.description.substring(0, 150) + '...'
      };

      // Store in localStorage for demo purposes
      const existingEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      existingEvents.push(newEvent);
      localStorage.setItem('pastEvents', JSON.stringify(existingEvents));

      // Reset form
      setFormData({
        title: '',
        description: '',
        domain: '',
        date: '',
        bannerPhoto: null,
        galleryImages: []
      });
      setBannerPreview(null);
      setGalleryPreviews([]);

      alert('Event created successfully!');
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-800">Create Past Event</h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
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

              {/* Event Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Event Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter detailed event description"
                  rows={6}
                  required
                />
              </div>

              {/* Domain and Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select value={formData.domain} onValueChange={(value) => handleInputChange('domain', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CMD">CMD</SelectItem>
                      <SelectItem value="CSD">CSD</SelectItem>
                      <SelectItem value="PDD">PDD</SelectItem>
                      <SelectItem value="ISD">ISD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Banner Photo */}
              <div className="space-y-2">
                <Label htmlFor="banner">Banner Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {bannerPreview ? (
                    <div className="relative">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-48 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setBannerPreview(null);
                          setFormData(prev => ({ ...prev, bannerPhoto: null }));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Upload banner image</p>
                      <input
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
                        className="mt-2"
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="space-y-2">
                <Label htmlFor="gallery">Photo Gallery</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Upload multiple images for gallery</p>
                    <input
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
                      className="mt-2"
                    >
                      Choose Files
                    </Button>
                  </div>
                  
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => removeGalleryImage(index)}
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
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPastEvents;
