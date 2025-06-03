
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Trash2, Edit3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  category?: string;
  venue?: string;
}

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventType, setEventType] = useState<'event' | 'gbm'>('event');

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: ''
  });

  const currentUser = localStorage.getItem('username') || 'user';
  const isAdmin = true;

  // Load events from localStorage
  useEffect(() => {
    const loadEvents = () => {
      const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      const gbmMeetings = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
      
      // Convert stored events to calendar format
      const formattedPastEvents = pastEvents.map((event: any) => ({
        id: parseInt(event.id) || Math.random(),
        title: event.title,
        date: new Date(event.date),
        startTime: '10:00',
        endTime: '16:00',
        description: event.description || event.shortDescription || '',
        type: event.category === 'Flagship' ? 'flagship' : 'event',
        location: event.venue || '',
        attendanceEnabled: false,
        registrationEnabled: true,
        createdBy: 'admin',
        category: event.category
      }));

      const formattedGBMs = gbmMeetings.map((gbm: any) => ({
        id: parseInt(gbm.id) || Math.random(),
        title: gbm.title,
        date: new Date(gbm.date),
        startTime: gbm.time || '18:00',
        endTime: '19:00',
        description: gbm.description,
        type: 'gbm',
        location: gbm.venue || '',
        attendanceEnabled: true,
        registrationEnabled: false,
        createdBy: 'admin'
      }));

      // Default events
      const defaultEvents: Event[] = [
        {
          id: 1,
          title: "BDC - Blood Donation Camp",
          date: new Date(2025, 9, 7),
          startTime: "10:00",
          endTime: "16:00",
          description: "Annual flagship Blood Donation Camp event at MUJ campus.",
          type: 'flagship',
          location: "MUJ Main Campus",
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
          attendanceEnabled: false,
          registrationEnabled: true,
          createdBy: "admin"
        }
      ];

      setEvents([...defaultEvents, ...formattedPastEvents, ...formattedGBMs]);
    };

    loadEvents();

    const handleStorageChange = () => loadEvents();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
      type: eventType,
      attendanceEnabled: eventType === 'gbm',
      registrationEnabled: eventType === 'event',
      createdBy: currentUser,
      category: newEvent.category
    };
    
    setEvents([...events, createdEvent]);
    
    // Save to appropriate localStorage
    if (eventType === 'gbm') {
      const gbmMeetings = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
      gbmMeetings.push({
        id: nextId.toString(),
        title: newEvent.title,
        date: newEvent.date.toISOString().split('T')[0],
        time: newEvent.startTime,
        venue: newEvent.location,
        description: newEvent.description,
        type: 'gbm',
        enableAttendance: true,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('gbmMeetings', JSON.stringify(gbmMeetings));
    } else {
      const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      pastEvents.push({
        id: nextId.toString(),
        title: newEvent.title,
        date: newEvent.date.toISOString().split('T')[0],
        venue: newEvent.location,
        description: newEvent.description,
        shortDescription: newEvent.description,
        category: newEvent.category,
        images: [],
        bannerUrl: '',
        galleryUrls: []
      });
      localStorage.setItem('pastEvents', JSON.stringify(pastEvents));
    }
    
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
    
    setShowEventForm(false);
    setNewEvent({
      title: '',
      date: new Date(),
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      category: ''
    });
    console.log('Event created:', createdEvent);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    setEvents(events.filter(event => event.id !== selectedEvent.id));
    
    // Remove from localStorage
    if (selectedEvent.type === 'gbm') {
      const gbmMeetings = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
      const updatedGBMs = gbmMeetings.filter((gbm: any) => gbm.id !== selectedEvent.id.toString());
      localStorage.setItem('gbmMeetings', JSON.stringify(updatedGBMs));
    } else {
      const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      const updatedEvents = pastEvents.filter((event: any) => event.id !== selectedEvent.id.toString());
      localStorage.setItem('pastEvents', JSON.stringify(updatedEvents));
    }
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
    
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
        
        <div className="flex gap-2">
          <Button 
            className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
            onClick={() => {
              setEventType('event');
              setShowEventForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setEventType('gbm');
              setShowEventForm(true);
            }}
          >
            <Users className="w-4 h-4 mr-2" />
            New GBM / Meeting
          </Button>
        </div>
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
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => {setSelectedEvent(null); setEditMode(false);}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedEvent?.title}</span>
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
                     selectedEvent.type === 'gbm' ? 'GBM / Meeting' : 'Event'}
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
                  <p className="text-sm mt-1">{selectedEvent.description}</p>
                </div>
              </div>

              {/* Registration Section - Only for regular events */}
              {selectedEvent.type === 'event' && selectedEvent.registrationEnabled && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium">Event Registration</h4>
                  <p className="text-sm text-gray-600">Registration is enabled for this event.</p>
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
            <DialogTitle>
              Create New {eventType === 'gbm' ? 'GBM / Meeting' : 'Event'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {eventType === 'gbm' ? 'Meeting Title' : 'Event Title'}
              </Label>
              <Input
                id="title"
                placeholder={eventType === 'gbm' ? 'Enter meeting title' : 'Enter event title'}
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
            </div>

            {eventType === 'event' && (
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newEvent.category} onValueChange={(value) => setNewEvent({...newEvent, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSD">Community Service Development (CSD)</SelectItem>
                    <SelectItem value="CMD">Club/Member Development (CMD)</SelectItem>
                    <SelectItem value="ISD">International Service Development (ISD)</SelectItem>
                    <SelectItem value="PDD">Professional Development (PDD)</SelectItem>
                    <SelectItem value="Flagship">Flagship Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
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
              <Label htmlFor="location">
                {eventType === 'gbm' ? 'Venue' : 'Location'}
              </Label>
              <Input
                id="location"
                placeholder={eventType === 'gbm' ? 'Enter venue' : 'Enter location'}
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder={eventType === 'gbm' ? 'Enter meeting agenda' : 'Enter event description'}
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
                Create {eventType === 'gbm' ? 'Meeting' : 'Event'}
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
