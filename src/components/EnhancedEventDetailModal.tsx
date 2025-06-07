
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Save } from 'lucide-react';

interface EventDetailModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: any) => void;
  onDelete: (eventId: string) => void;
}

type RegistrationStatus = 'not_registered' | 'registered' | 'checking';

const EnhancedEventDetailModal = ({ 
  event, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete
}: EventDetailModalProps) => {
  // All hooks must be declared before any early returns
  const [enableRegistration, setEnableRegistration] = useState(false);
  const [enableAttendance, setEnableAttendance] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    phoneNumber: '',
    registrationNumber: ''
  });
  const [newAttendee, setNewAttendee] = useState({
    fullName: '',
    registrationNumber: ''
  });
  const [meetingMinutes, setMeetingMinutes] = useState('');
  const [hasMarkedAttendance, setHasMarkedAttendance] = useState(false);
  const [userRegistrationStatus, setUserRegistrationStatus] = useState<RegistrationStatus>('not_registered');

  // Initialize state values when event changes
  useEffect(() => {
    if (event) {
      setEnableRegistration(event.enableRegistration || false);
      setEnableAttendance(event.enableAttendance || false);
      setMeetingMinutes(event.meetingMinutes || '');
      setUserRegistrationStatus('not_registered');
    }
  }, [event]);

  // Check registration status when registration number changes
  useEffect(() => {
    if (event && registrationData.registrationNumber.trim()) {
      const isUserRegistered = event.registeredUsers?.some((user: any) => 
        user.registrationNumber === registrationData.registrationNumber.trim()
      );
      setUserRegistrationStatus(isUserRegistered ? 'registered' : 'not_registered');
    } else {
      setUserRegistrationStatus('not_registered');
    }
  }, [registrationData.registrationNumber, event?.registeredUsers]);

  // Early return after all hooks are declared
  if (!event) return null;

  const isGBM = event.type === 'gbm' || event.type === 'meeting';

  const isEventInPast = (eventDate: string, eventTime: string) => {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    return eventDateTime < now;
  };

  const isPastEvent = isEventInPast(event.date, event.startTime);

  const handleRegistrationToggle = (checked: boolean) => {
    if (isPastEvent) {
      alert('Cannot modify past events.');
      return;
    }

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
    
    // Also update in pastEvents
    const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
    const updatedPastEvents = pastEvents.map((e: any) => {
      if (e.id === event.id) {
        return { ...e, enableRegistration: checked };
      }
      return e;
    });
    localStorage.setItem('pastEvents', JSON.stringify(updatedPastEvents));
    
    window.dispatchEvent(new Event('storage'));
  };

  const handleAttendanceToggle = (checked: boolean) => {
    if (isPastEvent) {
      alert('Cannot modify past events.');
      return;
    }

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
    
    // Also update in pastEvents
    const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
    const updatedPastEvents = pastEvents.map((e: any) => {
      if (e.id === event.id) {
        return { ...e, enableAttendance: checked };
      }
      return e;
    });
    localStorage.setItem('pastEvents', JSON.stringify(updatedPastEvents));
    
    window.dispatchEvent(new Event('storage'));
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationData.fullName && registrationData.phoneNumber && registrationData.registrationNumber) {
      // Check if user already registered
      if (userRegistrationStatus === 'registered') {
        alert('You have already registered for this event!');
        return;
      }

      const newUser = { ...registrationData, registeredAt: new Date().toISOString() };
      
      // Update the event in all storage locations
      const storageKeys = ['calendarEvents', 'gbmMeetings', 'pastEvents'];
      storageKeys.forEach(key => {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = stored.map((e: any) => {
          if (e.id === event.id) {
            const registeredUsers = e.registeredUsers || [];
            return { ...e, registeredUsers: [...registeredUsers, newUser] };
          }
          return e;
        });
        localStorage.setItem(key, JSON.stringify(updated));
      });

      setRegistrationData({ fullName: '', phoneNumber: '', registrationNumber: '' });
      setUserRegistrationStatus('registered');
      window.dispatchEvent(new Event('storage'));
      alert('Registration successful!');
    }
  };

  const handleAttendanceAction = (status: 'present' | 'absent') => {
    if (!newAttendee.fullName || !newAttendee.registrationNumber) {
      alert('Please enter both name and registration number.');
      return;
    }

    if (hasMarkedAttendance) {
      alert('You have already marked attendance for this session.');
      return;
    }

    const userId = newAttendee.registrationNumber;
    
    // Update attendance
    const storageKeys = ['calendarEvents', 'gbmMeetings', 'pastEvents'];
    storageKeys.forEach(key => {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = stored.map((e: any) => {
        if (e.id === event.id) {
          const attendance = e.attendance || {};
          return { ...e, attendance: { ...attendance, [userId]: status } };
        }
        return e;
      });
      localStorage.setItem(key, JSON.stringify(updated));
    });

    // Add user to registeredUsers if not exists
    const existingUser = event.registeredUsers?.find((user: any) => 
      user.registrationNumber === newAttendee.registrationNumber
    );
    
    if (!existingUser) {
      const attendeeData = { 
        ...newAttendee, 
        phoneNumber: '', 
        registeredAt: new Date().toISOString() 
      };
      
      storageKeys.forEach(key => {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = stored.map((e: any) => {
          if (e.id === event.id) {
            const registeredUsers = e.registeredUsers || [];
            return { ...e, registeredUsers: [...registeredUsers, attendeeData] };
          }
          return e;
        });
        localStorage.setItem(key, JSON.stringify(updated));
      });
    }
    
    setNewAttendee({ fullName: '', registrationNumber: '' });
    setHasMarkedAttendance(true);
    window.dispatchEvent(new Event('storage'));
    alert(`Attendance marked as ${status}!`);
  };

  const handleSaveMinutes = () => {
    const storageKeys = ['calendarEvents', 'gbmMeetings', 'pastEvents'];
    storageKeys.forEach(key => {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = stored.map((e: any) => {
        if (e.id === event.id) {
          return { ...e, meetingMinutes };
        }
        return e;
      });
      localStorage.setItem(key, JSON.stringify(updated));
    });
    window.dispatchEvent(new Event('storage'));
    alert('Meeting minutes saved successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
            <div className="flex gap-2">
              {!isPastEvent && (
                <>
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
                    onClick={() => onDelete(event.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={isGBM ? "bg-blue-600" : "bg-rotaract-orange"}>
              {event.type === 'gbm' ? "GBM" : event.type === 'meeting' ? "Meeting" : "Event"}
            </Badge>
            {isPastEvent && <Badge variant="secondary">Past Event</Badge>}
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
                    disabled={isPastEvent}
                  />
                  <Label htmlFor="enableRegistration" className="text-sm">Enable Registration</Label>
                </div>
              </div>

              {enableRegistration && !isPastEvent && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Register for Event</h4>
                    {userRegistrationStatus === 'registered' ? (
                      <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-green-600 text-lg mb-2">✓</div>
                        <p className="text-green-700 font-medium">You have already registered for this event!</p>
                        <p className="text-green-600 text-sm mt-1">Registration Number: {registrationData.registrationNumber}</p>
                      </div>
                    ) : (
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
                          {userRegistrationStatus === 'registered' && registrationData.registrationNumber && (
                            <p className="text-red-500 text-xs mt-1">This registration number is already registered for this event.</p>
                          )}
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90"
                          disabled={userRegistrationStatus === 'registered'}
                        >
                          Register
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* GBM/Meeting Sections */}
          {isGBM && (
            <div className="space-y-6">
              {/* Meeting Minutes */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Minutes of Meeting</h4>
                    <Button
                      size="sm"
                      onClick={handleSaveMinutes}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Minutes
                    </Button>
                  </div>
                  <Textarea
                    value={meetingMinutes}
                    onChange={(e) => setMeetingMinutes(e.target.value)}
                    placeholder="Enter meeting minutes, agenda items, decisions made, action items, etc..."
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>

              {/* Attendance Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Attendance</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableAttendance"
                      checked={enableAttendance}
                      onCheckedChange={handleAttendanceToggle}
                      disabled={isPastEvent}
                    />
                    <Label htmlFor="enableAttendance" className="text-sm">Enable Attendance</Label>
                  </div>
                </div>

                {enableAttendance && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Mark Attendance</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="newName" className="text-sm">Full Name</Label>
                            <Input
                              id="newName"
                              value={newAttendee.fullName}
                              onChange={(e) => setNewAttendee(prev => ({ ...prev, fullName: e.target.value }))}
                              placeholder="Enter your name"
                              disabled={hasMarkedAttendance}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newRegNo" className="text-sm">Registration Number</Label>
                            <Input
                              id="newRegNo"
                              value={newAttendee.registrationNumber}
                              onChange={(e) => setNewAttendee(prev => ({ ...prev, registrationNumber: e.target.value }))}
                              placeholder="Enter your registration number"
                              disabled={hasMarkedAttendance}
                            />
                          </div>
                        </div>
                        {!hasMarkedAttendance && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAttendanceAction('present')}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={!newAttendee.fullName || !newAttendee.registrationNumber}
                            >
                              Present
                            </Button>
                            <Button
                              onClick={() => handleAttendanceAction('absent')}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={!newAttendee.fullName || !newAttendee.registrationNumber}
                            >
                              Absent
                            </Button>
                          </div>
                        )}
                        {hasMarkedAttendance && (
                          <p className="text-sm text-gray-600">Attendance has been marked for this session.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedEventDetailModal;
