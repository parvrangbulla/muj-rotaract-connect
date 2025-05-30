
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  registrationRequired?: boolean;
}

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    description: '',
    location: ''
  });
  const [registrationData, setRegistrationData] = useState({
    name: '',
    phone: '',
    registrationNumber: ''
  });

  const events: Event[] = [
    {
      id: 1,
      title: "BDC - Blood Donation Camp",
      date: new Date(2025, 9, 7), // October 7, 2025
      startTime: "10:00",
      endTime: "16:00",
      description: "Annual flagship Blood Donation Camp event at MUJ campus. Help save lives by donating blood.",
      type: 'flagship',
      location: "MUJ Main Campus"
    },
    {
      id: 2,
      title: "GBM - General Body Meeting",
      date: new Date(2025, 4, 31), // May 31, 2025
      startTime: "17:00",
      endTime: "18:30",
      description: "Monthly general body meeting to discuss upcoming events and club activities.",
      type: 'gbm',
      location: "Conference Room A"
    },
    {
      id: 3,
      title: "Daan Utsav",
      date: new Date(2025, 8, 5), // September 5, 2025
      startTime: "09:00",
      endTime: "17:00",
      description: "Festival of giving - donation drive for underprivileged communities.",
      type: 'flagship',
      location: "MUJ Campus"
    },
    {
      id: 4,
      title: "Mural Painting",
      date: new Date(2025, 5, 2), // June 2, 2025
      startTime: "14:00",
      endTime: "17:00",
      description: "Creative mural painting workshop for community beautification.",
      type: 'event',
      location: "Art Block",
      registrationRequired: true
    }
  ];

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
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
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event created:', newEvent);
    setShowEventForm(false);
    setNewEvent({
      title: '',
      date: new Date(),
      startTime: '',
      endTime: '',
      description: '',
      location: ''
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', registrationData);
    alert('You are successfully registered!');
    setShowRegistrationForm(false);
    setRegistrationData({ name: '', phone: '', registrationNumber: '' });
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
                        className="absolute inset-1 rounded p-1 cursor-pointer text-xs font-medium transition-all hover:scale-105"
                        style={{
                          backgroundColor: event.type === 'flagship' ? '#f59120' : 
                                         event.type === 'gbm' ? '#3b82f6' : '#10b981',
                          color: 'white'
                        }}
                      >
                        {event.title}
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
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
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
              <p className="text-sm">{selectedEvent.description}</p>
              
              {selectedEvent.registrationRequired && (
                <Button 
                  onClick={() => setShowRegistrationForm(true)}
                  className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
                >
                  Register for Event
                </Button>
              )}
            </div>
          )}
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

      {/* Registration Form Modal */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Registration</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={registrationData.name}
                onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={registrationData.phone}
                onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="regNumber">Registration Number</Label>
              <Input
                id="regNumber"
                placeholder="Enter your registration number"
                value={registrationData.registrationNumber}
                onChange={(e) => setRegistrationData({...registrationData, registrationNumber: e.target.value})}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
              >
                Submit Registration
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowRegistrationForm(false)}
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
