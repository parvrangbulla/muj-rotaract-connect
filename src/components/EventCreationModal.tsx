
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreate: (eventData: any) => void;
  editData?: any;
  isGBM?: boolean;
}

const EventCreationModal = ({ isOpen, onClose, onEventCreate, editData, isGBM = false }: EventCreationModalProps) => {
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    date: editData?.date || '',
    startTime: editData?.startTime || '',
    endTime: editData?.endTime || '',
    location: editData?.location || '',
    description: editData?.description || '',
    enableRegistration: editData?.enableRegistration || false,
    enableAttendance: editData?.enableAttendance || false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      id: editData?.id || Date.now().toString(),
      type: isGBM ? 'gbm' : 'event',
      createdAt: editData?.createdAt || new Date().toISOString(),
      registeredUsers: editData?.registeredUsers || [],
      attendance: editData?.attendance || {}
    };
    
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
        enableRegistration: false,
        enableAttendance: false,
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
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

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
              placeholder="Enter event description"
              rows={3}
              required
            />
          </div>

          {!isGBM && (
            <div className="flex items-center space-x-2">
              <Switch
                id="enableRegistration"
                checked={formData.enableRegistration}
                onCheckedChange={(checked) => handleInputChange('enableRegistration', checked)}
              />
              <Label htmlFor="enableRegistration">Enable Registration</Label>
            </div>
          )}

          {formData.enableRegistration && !isGBM && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registration Form Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  When event registration is enabled, users registering for the event must fill the following fields:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-rotaract-orange rounded-full"></span>
                    <span>Full Name (Text input)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-rotaract-orange rounded-full"></span>
                    <span>Phone Number (Text input, number only, 10 digits)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-rotaract-orange rounded-full"></span>
                    <span>Registration Number (Text input)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isGBM && (
            <div className="flex items-center space-x-2">
              <Switch
                id="enableAttendance"
                checked={formData.enableAttendance}
                onCheckedChange={(checked) => handleInputChange('enableAttendance', checked)}
              />
              <Label htmlFor="enableAttendance">Enable Attendance</Label>
            </div>
          )}

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
