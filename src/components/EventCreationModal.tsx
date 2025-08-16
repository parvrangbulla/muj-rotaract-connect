
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreate: (eventData: any) => void;
  editData?: any;
  isGBM?: boolean;
}

const EventCreationModal = ({ isOpen, onClose, onEventCreate, editData, isGBM = false }: EventCreationModalProps) => {
  const { isExecutive } = useAuth();
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    date: editData?.date || '',
    startTime: editData?.startTime || '',
    endTime: editData?.endTime || '',
    location: editData?.location || '',
    description: editData?.description || '',
    meetingType: editData?.meetingType || 'meeting', // 'meeting' or 'gbm'
    eventCategory: editData?.eventCategory || 'working-team', // 'working-team' or 'gbm'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Role-based access control
  if (!isExecutive) {
    return null; // Don't render the modal for non-executives
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug logging
    console.log('EventCreationModal: Form data:', formData);
    console.log('EventCreationModal: isGBM:', isGBM);
    console.log('EventCreationModal: meetingType:', formData.meetingType);
    console.log('EventCreationModal: eventCategory from form:', formData.eventCategory);
    
    const eventData = {
      ...formData,
      id: editData?.id || Date.now().toString(),
      type: isGBM ? (formData.meetingType === 'gbm' ? 'gbm' : 'meeting') : 'event',
      createdAt: editData?.createdAt || new Date().toISOString(),
      registeredUsers: editData?.registeredUsers || [],
      attendance: editData?.attendance || {},
      enableRegistration: editData?.enableRegistration || false,
      enableAttendance: editData?.enableAttendance || false,
      meetingMinutes: editData?.meetingMinutes || '',
      showOnGuestCalendar: isGBM ? formData.meetingType === 'gbm' : formData.eventCategory === 'gbm',
      // Always set eventCategory to a valid value
      eventCategory: isGBM ? formData.meetingType : (formData.eventCategory || 'working-team')
    };
    
    // Debug logging
    console.log('EventCreationModal: Final event data:', eventData);
    console.log('EventCreationModal: Final eventCategory:', eventData.eventCategory);
    
    onEventCreate(eventData);
    onClose();
    
    // Reset form if not editing
    if (!editData) {
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        meetingType: 'meeting',
        eventCategory: 'working-team',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit' : 'Create New'} {isGBM ? 'GBM / Meeting' : 'Event'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{isGBM ? 'Meeting' : 'Event'} Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={`Enter ${isGBM ? 'meeting' : 'event'} title`}
              required
            />
          </div>

          {/* Meeting Type Dropdown - Only for GBM/Meeting creation */}
          {isGBM && (
            <div className="space-y-2">
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select
                value={formData.meetingType}
                onValueChange={(value) => handleInputChange('meetingType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="gbm">GBM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Event Category Dropdown - Only for regular events */}
          {!isGBM && (
            <div className="space-y-2">
              <Label htmlFor="eventCategory">Event Category</Label>
              <Select
                value={formData.eventCategory}
                onValueChange={(value) => handleInputChange('eventCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="working-team">Working Team</SelectItem>
                  <SelectItem value="gbm">GBM</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Working Team events are only visible to logged-in users. GBM events are visible to all users with registration options.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={`Enter ${isGBM ? 'meeting' : 'event'} description`}
              rows={3}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-rotaract-orange hover:bg-rotaract-orange/90">
              {editData ? 'Update' : 'Create'} {isGBM ? 'Meeting' : 'Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationModal;
