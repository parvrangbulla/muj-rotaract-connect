import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

interface Event {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description: string;
  type: 'event' | 'gbm' | 'flagship';
  location?: string;
  attendanceEnabled: boolean;
  registrationEnabled: boolean;
  createdBy?: string;
  userAttendance?: 'present' | 'absent' | null;
  userRegistered?: boolean;
}

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "BDC - Blood Donation Camp",
      date: new Date(2025, 9, 7),
      startTime: "10:00",
      endTime: "16:00",
      description: "Annual flagship Blood Donation Camp event at MUJ campus. Help save lives by donating blood.",
      type: 'flagship',
      location: "MUJ Main Campus",
      attendanceEnabled: true,
      registrationEnabled: true,
      createdBy: "admin"
    },
    {
      id: 2,
      title: "GBM - General Body Meeting",
      date: new Date(2025, 4, 31),
      startTime: "17:00",
      endTime: "18:00",
      description: "Monthly general body meeting to discuss upcoming events and club activities.",
      type: 'gbm',
      location: "Conference Room A",
      attendanceEnabled: true,
      registrationEnabled: false,
      createdBy: "admin"
    },
    {
      id: 3,
      title: "Daan Utsav",
      date: new Date(2025, 8, 5),
      startTime: "09:00",
      endTime: "17:00",
      description: "Festival of giving - donation drive for underprivileged communities.",
      type: 'flagship',
      location: "MUJ Campus",
      attendanceEnabled: false,
      registrationEnabled: true,
      createdBy: "admin"
    },
    {
      id: 4,
      title: "Mural Painting",
      date: new Date(2025, 5, 2),
      startTime: "14:00",
      endTime: "17:00",
      description: "Creative mural painting workshop for community beautification.",
      type: 'event',
      location: "Art Block",
      attendanceEnabled: true,
      registrationEnabled: false,
      createdBy: "admin"
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    description: '',
    location: ''
  });

  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    phone: '',
    registrationNumber: ''
  });

  const currentUser = localStorage.getItem('username') || 'user';
  const isAdmin = true;

  // Updated time slots for 09:00 AM to 06:00 PM
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDateAndTime = (date: Date, timeSlot: string) => {
    return events.filter(event => {
      if (event.date.getDate() !== date.getDate() || 
          event.date.getMonth() !== date.getMonth() || 
          event.date.getFullYear() !== date.getFullYear()) {
        return false;
      }
      
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);
      
      return slotHour >= eventStartHour && slotHour < eventEndHour;
    });
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEditMode(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = Math.max(...events.map(e => e.id)) + 1;
    const createdEvent: Event = {
      id: nextId,
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      description: newEvent.description,
      location: newEvent.location,
      type: 'event',
      attendanceEnabled: false,
      registrationEnabled: false,
      createdBy: currentUser,
      userAttendance: null,
      userRegistered: false
    };
    
    setEvents([...events, createdEvent]);
    setShowEventForm(false);
    setNewEvent({
      title: '',
      date: new Date(),
      startTime: '',
      endTime: '',
      description: '',
      location: ''
    });
    console.log('Event created:', createdEvent);
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    
    setEvents(events.map(event => 
      event.id === selectedEvent.id ? selectedEvent : event
    ));
    setEditMode(false);
    console.log('Event updated:', selectedEvent);
  };

  const handleToggleAttendance = () => {
    if (!selectedEvent) return;
    
    const updatedEvent = { ...selectedEvent, attendanceEnabled: !selectedEvent.attendanceEnabled };
    setSelectedEvent(updatedEvent);
    setEvents(events.map(event => 
      event.id === selectedEvent.id ? updatedEvent : event
    ));
  };

  const handleToggleRegistration = () => {
    if (!selectedEvent) return;
    
    const updatedEvent = { ...selectedEvent, registrationEnabled: !selectedEvent.registrationEnabled };
    setSelectedEvent(updatedEvent);
    setEvents(events.map(event => 
      event.id === selectedEvent.id ? updatedEvent : event
    ));
  };

  const handleAttendanceMarkPresent = () => {
    if (!selectedEvent) return;
    
    const today = new Date();
    const eventDate = selectedEvent.date;
    
    if (eventDate > today) {
      alert('You cannot mark attendance for future events!');
      return;
    }
    
    const updatedEvent = { ...selectedEvent, userAttendance: 'present' as const };
    setEvents(events.map(event => 
      event.id === selectedEvent.id ? updatedEvent : event
    ));
    setSelectedEvent(updatedEvent);
    console.log('Marked present for event:', selectedEvent.id);
  };

  const handleAttendanceMarkAbsent = () => {
    if (!selectedEvent) return;
    
    const updatedEvent = { ...selectedEvent, userAttendance: 'absent' as const };
    setEvents(events.map(event => 
      event.id === selectedEvent.id ? updatedEvent : event
    ));
    setSelectedEvent(updatedEvent);
    console.log('Marked absent for event:', selectedEvent.id);
  };

  const handleRegistration = () => {
    if (!selectedEvent) return;
    
    const updatedEvent = { ...selectedEvent, userRegistered: true };
    setEvents(events.map(event => 
      event.id === selectedEvent.id ? updatedEvent : event
    ));
    setSelectedEvent(updatedEvent);
    setRegistrationForm({ name: '', phone: '', registrationNumber: '' });
    console.log('Registered for event:', selectedEvent.id, registrationForm);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    setEvents(events.filter(event => event.id !== selectedEvent.id));
    setSelectedEvent(null);
    setShowDeleteConfirm(false);
    console.log('Event deleted:', selectedEvent.id);
  };

  const canDeleteEvent = (event: Event) => {
    return isAdmin || event.createdBy === currentUser;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold text-black">
            {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
          </h2>
          
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Jump to date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentWeek}
                onSelect={(date) => {
                  if (date) {
                    setCurrentWeek(date);
                    setShowDatePicker(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
          onClick={() => setShowEventForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 min-w-full">
          {/* Time column header */}
          <div className="p-2 border-b border-gray-200 text-center font-medium text-sm text-gray-600">
            Time
          </div>
          
          {/* Day headers */}
          {weekDays.map((day, index) => (
            <div key={index} className="p-2 border-b border-gray-200 text-center">
              <div className="text-sm font-medium text-gray-600">{dayNames[index]}</div>
              <div className="text-lg font-semibold text-black">{day.getDate()}</div>
            </div>
          ))}

          {/* Time slots and events */}
          {timeSlots.map((timeSlot) => (
            <>
              {/* Time label */}
              <div key={`time-${timeSlot}`} className="p-2 border-r border-gray-200 text-sm text-gray-600 text-center">
                {timeSlot}
              </div>
              
              {/* Day cells */}
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDateAndTime(day, timeSlot);
                
                return (
                  <div 
                    key={`${timeSlot}-${dayIndex}`}
                    className="min-h-16 border-r border-b border-gray-100 p-1 relative"
                  >
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className="absolute inset-1 rounded p-1 cursor-pointer text-xs font-medium transition-all hover:scale-105 flex flex-col"
                        style={{
                          backgroundColor: event.type === 'flagship' ? '#f59120' : 
                                         event.type === 'gbm' ? '#3b82f6' : '#10b981',
                          color: 'white'
                        }}
                      >
                        <span>{event.title}</span>
                        {event.userAttendance && (
                          <span className="text-xs">
                            {event.userAttendance === 'present' ? '✅' : '❌'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Enhanced Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => {setSelectedEvent(null); setEditMode(false);}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {editMode ? (
                <Input 
                  value={selectedEvent?.title || ''} 
                  onChange={(e) => setSelectedEvent(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="text-lg font-semibold"
                />
              ) : (
                <span>{selectedEvent?.title}</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editMode ? handleUpdateEvent() : setEditMode(true)}
              >
                <Edit3 className="w-4 h-4" />
                {editMode ? 'Save' : 'Edit'}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Details */}
              <div className="space-y-3">
                <div>
                  <Badge 
                    style={{
                      backgroundColor: selectedEvent.type === 'flagship' ? '#f59120' : 
                                     selectedEvent.type === 'gbm' ? '#3b82f6' : '#10b981'
                    }}
                    className="text-white"
                  >
                    {selectedEvent.type === 'flagship' ? 'Flagship Event' : 
                     selectedEvent.type === 'gbm' ? 'General Body Meeting' : 'Event'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    📅 {selectedEvent.date.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    🕐 {selectedEvent.startTime} - {selectedEvent.endTime}
                  </p>
                  {selectedEvent.location && (
                    <p className="text-sm text-gray-600">📍 {selectedEvent.location}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  {editMode ? (
                    <Textarea 
                      value={selectedEvent.description} 
                      onChange={(e) => setSelectedEvent(prev => prev ? {...prev, description: e.target.value} : null)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm mt-1">{selectedEvent.description}</p>
                  )}
                </div>
              </div>

              {/* Toggle Options */}
              {(isAdmin || selectedEvent.createdBy === currentUser) && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Event Settings</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="attendance-toggle">Enable Attendance</Label>
                    <Switch 
                      id="attendance-toggle"
                      checked={selectedEvent.attendanceEnabled}
                      onCheckedChange={handleToggleAttendance}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="registration-toggle">Enable Registration</Label>
                    <Switch 
                      id="registration-toggle"
                      checked={selectedEvent.registrationEnabled}
                      onCheckedChange={handleToggleRegistration}
                    />
                  </div>
                </div>
              )}

              {/* Registration Section */}
              {selectedEvent.registrationEnabled && !selectedEvent.userRegistered && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium">Event Registration</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label htmlFor="reg-name">Name</Label>
                      <Input
                        id="reg-name"
                        placeholder="Enter your name"
                        value={registrationForm.name}
                        onChange={(e) => setRegistrationForm(prev => ({...prev, name: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-phone">Phone Number</Label>
                      <Input
                        id="reg-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={registrationForm.phone}
                        onChange={(e) => setRegistrationForm(prev => ({...prev, phone: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-number">Registration Number</Label>
                      <Input
                        id="reg-number"
                        placeholder="Enter your registration number"
                        value={registrationForm.registrationNumber}
                        onChange={(e) => setRegistrationForm(prev => ({...prev, registrationNumber: e.target.value}))}
                      />
                    </div>
                    <Button 
                      onClick={handleRegistration}
                      className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
                      disabled={!registrationForm.name || !registrationForm.phone || !registrationForm.registrationNumber}
                    >
                      Register for Event
                    </Button>
                  </div>
                </div>
              )}

              {selectedEvent.registrationEnabled && selectedEvent.userRegistered && (
                <div className="space-y-3 border-t pt-4">
                  <div className="text-sm text-green-600 font-medium">
                    ✅ You are registered for this event
                  </div>
                </div>
              )}
              
              {/* Attendance Section */}
              {selectedEvent.attendanceEnabled && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium">Mark Attendance</h4>
                  {selectedEvent.userAttendance ? (
                    <div className="text-sm text-gray-600">
                      You marked yourself: <span className="font-medium">
                        {selectedEvent.userAttendance === 'present' ? '✅ Present' : '❌ Absent'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleAttendanceMarkPresent}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        size="sm"
                      >
                        ✅ Present
                      </Button>
                      <Button 
                        onClick={handleAttendanceMarkAbsent}
                        className="bg-red-600 hover:bg-red-700 text-white flex-1"
                        size="sm"
                      >
                        ❌ Absent
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Delete Button */}
              {canDeleteEvent(selectedEvent) && (
                <div className="border-t pt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={handleDeleteEvent}
                className="flex-1"
              >
                Delete Event
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEvent.date ? format(newEvent.date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEvent.date}
                    onSelect={(date) => date && setNewEvent({...newEvent, date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
              >
                Create Event
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEventForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyCalendar;
