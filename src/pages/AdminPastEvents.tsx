import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PastEvent {
  id: string;
  title: string;
  description: string;
  domain: 'CMD' | 'CSD' | 'PDD' | 'ISD';
  date: Date;
  bannerPhoto: string;
  galleryImages: string[];
}

const AdminPastEvents = () => {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    date: undefined as Date | undefined,
    bannerPhoto: '',
    galleryImages: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.domain || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const newEvent: PastEvent = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      domain: formData.domain as 'CMD' | 'CSD' | 'PDD' | 'ISD',
      date: formData.date,
      bannerPhoto: formData.bannerPhoto,
      galleryImages: formData.galleryImages
    };

    setEvents([...events, newEvent]);
    
    // Store in localStorage for now (in real app would be database)
    const existingEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
    localStorage.setItem('pastEvents', JSON.stringify([...existingEvents, newEvent]));

    // Reset form
    setFormData({
      title: '',
      description: '',
      domain: '',
      date: undefined,
      bannerPhoto: '',
      galleryImages: []
    });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, upload to storage service
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, bannerPhoto: url });
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      // In real app, upload to storage service
      const url = URL.createObjectURL(file);
      setFormData({ 
        ...formData, 
        galleryImages: [...formData.galleryImages, url] 
      });
    });
  };

  const removeGalleryImage = (index: number) => {
    const newImages = formData.galleryImages.filter((_, i) => i !== index);
    setFormData({ ...formData, galleryImages: newImages });
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'CSD': return 'bg-green-600';
      case 'CMD': return 'bg-blue-600';
      case 'ISD': return 'bg-purple-600';
      case 'PDD': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Past Events</h1>
        <p className="text-gray-600">Create and manage past events for the public events page</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Event Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Past Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>Domain</Label>
                <Select value={formData.domain} onValueChange={(value) => setFormData({ ...formData, domain: value })}>
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

              <div>
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="banner">Banner Photo</Label>
                <div className="mt-2">
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="mb-2"
                  />
                  {formData.bannerPhoto && (
                    <img 
                      src={formData.bannerPhoto} 
                      alt="Banner preview" 
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="gallery">Gallery Images</Label>
                <div className="mt-2">
                  <Input
                    id="gallery"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="mb-2"
                  />
                  {formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {formData.galleryImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Event
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Events */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Past Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No past events created yet</p>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge className={getDomainColor(event.domain)}>{event.domain}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{format(event.date, "PPP")}</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPastEvents;
