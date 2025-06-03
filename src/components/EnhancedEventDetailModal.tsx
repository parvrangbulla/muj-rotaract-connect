
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';

interface EventDetailModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: any) => void;
  onDelete: (eventId: string) => void;
  onAttendanceUpdate: (eventId: string, userId: string, status: 'present' | 'absent') => void;
  onRegistration: (eventId: string, userData: any) => void;
}

const EnhancedEventDetailModal = ({ 
  event, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onAttendanceUpdate,
  onRegistration
}: EventDetailModalProps) => {
  const [enableRegistration, setEnableRegistration] = useState(event?.enableRegistration || false);
  const [enableAttendance, setEnableAttendance] = useState(event?.enableAttendance || false);
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    phoneNumber: '',
    registrationNumber: ''
  });

  if (!event) return null;

  const isGBM = event.type === 'gbm';
  const hasRegisteredUsers = event.registeredUsers && event.registeredUsers.length > 0;

  const handleAttendanceChange = (userId: string, status: 'present' | 'absent') => {
    onAttendanceUpdate(event.id, userId, status);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  };

  const handleRegistrationToggle = (checked: boolean) => {
    setEnableRegistration(checked);
    // Update the event in storage
    const storageKey = isGBM ? 'gbmMeetings' : 'calendarEvents';
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = stored.map((e: any) => {
      if (e.id === event.id) {
        return { ...e, enableRegistration: checked };
      }
      return e;
    });
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAttendanceToggle = (checked: boolean) => {
    setEnableAttendance(checked);
    // Update the event in storage
    const storageKey = isGBM ? 'gbmMeetings' : 'calendarEvents';
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = stored.map((e: any) => {
      if (e.id === event.id) {
        return { ...e, enableAttendance: checked };
      }
      return e;
    });
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationData.fullName && registrationData.phoneNumber && registrationData.registrationNumber) {
      onRegistration(event.id, registrationData);
      setRegistrationData({ fullName: '', phoneNumber: '', registrationNumber: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(event)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={isGBM ? "bg-blue-600" : "bg-rotaract-orange"}>
              {isGBM ? "GBM / Meeting" : "Event"}
            </Badge>
            <span className="text-sm text-gray-500">
              {event.date} • {event.startTime} - {event.endTime}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Location:</span> {event.location}</p>
              <p><span className="font-medium">Description:</span> {event.description}</p>
            </div>
          </div>

          {/* Registration Section - Only for Events */}
          {!isGBM && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Registration</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableRegistration"
                    checked={enableRegistration}
                    onCheckedChange={handleRegistrationToggle}
                  />
                  <Label htmlFor="enableRegistration" className="text-sm">Enable Registration</Label>
                </div>
              </div>

              {enableRegistration && (
                <div className="space-y-4">
                  {/* Registration Form */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Register for Event</h4>
                      <form onSubmit={handleRegistrationSubmit} className="space-y-3">
                        <div>
                          <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                          <Input
                            id="fullName"
                            value={registrationData.fullName}
                            onChange={(e) => setRegistrationData(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            type="tel"
                            value={registrationData.phoneNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setRegistrationData(prev => ({ ...prev, phoneNumber: value }));
                            }}
                            placeholder="Enter 10-digit phone number"
                            maxLength={10}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="registrationNumber" className="text-sm">Registration Number</Label>
                          <Input
                            id="registrationNumber"
                            value={registrationData.registrationNumber}
                            onChange={(e) => setRegistrationData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                            placeholder="Enter registration number"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90">
                          Register
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Registered Participants */}
                  {hasRegisteredUsers && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Registered Participants ({event.registeredUsers.length})</h4>
                        <div className="space-y-2">
                          {event.registeredUsers.map((user: any, index: number) => (
                            <div key={index} className="p-2 border rounded-lg">
                              <div className="text-sm">
                                <p className="font-medium">{user.fullName}</p>
                                <p className="text-gray-600">Phone: {user.phoneNumber}</p>
                                <p className="text-gray-600">Reg. No: {user.registrationNumber}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Attendance Section - Only for GBMs */}
          {isGBM && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Attendance</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableAttendance"
                    checked={enableAttendance}
                    onCheckedChange={handleAttendanceToggle}
                  />
                  <Label htmlFor="enableAttendance" className="text-sm">Enable Attendance</Label>
                </div>
              </div>

              {enableAttendance && hasRegisteredUsers ? (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Mark Attendance</h4>
                    <div className="space-y-3">
                      {event.registeredUsers.map((user: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{user.fullName}</p>
                            <p className="text-xs text-gray-600">{user.registrationNumber}</p>
                          </div>
                          <Select
                            value={event.attendance?.[user.registrationNumber] || 'pending'}
                            onValueChange={(value) => handleAttendanceChange(user.registrationNumber, value as 'present' | 'absent')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="present">Present</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : enableAttendance && !hasRegisteredUsers ? (
                <p className="text-sm text-gray-500">No registered participants for attendance tracking.</p>
              ) : (
                <p className="text-sm text-gray-500">Enable attendance to track participant presence.</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedEventDetailModal;
