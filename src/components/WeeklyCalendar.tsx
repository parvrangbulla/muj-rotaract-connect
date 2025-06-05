import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import EventCreationModal from './EventCreationModal';
import EnhancedEventDetailModal from './EnhancedEventDetailModal';

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showGBMModal, setShowGBMModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [jumpDate, setJumpDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    loadEvents();
    const handleStorageChange = () => loadEvents();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadEvents = () => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      const storedGBMs = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
      
      // Ensure we have arrays
      const events = Array.isArray(storedEvents) ? storedEvents : [];
      const gbms = Array.isArray(storedGBMs) ? storedGBMs : [];
      
      setEvents([...events, ...gbms]);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    }
  };

  const isEventInPast = (eventDate: string, eventTime: string) => {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    return eventDateTime < now;
  };

  const saveEvent = (eventData: any) => {
    // Check if event is in the past
    const isPastEvent = isEventInPast(eventData.date, eventData.startTime);
    
    if (isPastEvent && !editingEvent) {
      alert('Cannot create events in the past. Please select a future date and time.');
      return;
    }

    const isGBM = eventData.type === 'gbm';
    const eventWithDefaults = {
      ...eventData,
      id: editingEvent?.id || Date.now().toString(),
      type: isGBM ? 'gbm' : 'event',
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      registeredUsers: editingEvent?.registeredUsers || [],
      attendance: editingEvent?.attendance || {},
      enableRegistration: editingEvent?.enableRegistration || false,
      enableAttendance: editingEvent?.enableAttendance || false
    };

    // Determine storage location based on timing
    if (isPastEvent) {
      // Add to past events
      const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      const pastEventData = {
        id: eventWithDefaults.id,
        title: eventWithDefaults.title,
        date: eventWithDefaults.date,
        description: eventWithDefaults.description,
        category: isGBM ? 'GBM' : 'Event',
        shortDescription: eventWithDefaults.description.substring(0, 100),
        venue: eventWithDefaults.location,
        images: [],
        bannerUrl: '',
        galleryUrls: [],
        enableRegistration: eventWithDefaults.enableRegistration,
        enableAttendance: eventWithDefaults.enableAttendance,
        registeredUsers: eventWithDefaults.registeredUsers,
        attendance: eventWithDefaults.attendance
      };
      
      if (editingEvent) {
        const updatedPastEvents = pastEvents.map((e: any) => 
          e.id === editingEvent.id ? pastEventData : e
        );
        localStorage.setItem('pastEvents', JSON.stringify(updatedPastEvents));
      } else {
        pastEvents.push(pastEventData);
        localStorage.setItem('pastEvents', JSON.stringify(pastEvents));
      }
    } else {
      // Add to current events (calendar)
      const storageKey = isGBM ? 'gbmMeetings' : 'calendarEvents';
      const existingEvents = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (editingEvent) {
        const updatedEvents = existingEvents.map((e: any) => 
          e.id === editingEvent.id ? eventWithDefaults : e
        );
        localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
      } else {
        existingEvents.push(eventWithDefaults);
        localStorage.setItem(storageKey, JSON.stringify(existingEvents));
      }

      // Also add to past events for dashboard display
      const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
      const pastEventData = {
        id: eventWithDefaults.id,
        title: eventWithDefaults.title,
        date: eventWithDefaults.date,
        description: eventWithDefaults.description,
        category: isGBM ? 'GBM' : 'Event',
        shortDescription: eventWithDefaults.description.substring(0, 100),
        venue: eventWithDefaults.location,
        images: [],
        bannerUrl: '',
        galleryUrls: [],
        enableRegistration: eventWithDefaults.enableRegistration,
        enableAttendance: eventWithDefaults.enableAttendance,
        registeredUsers: eventWithDefaults.registeredUsers,
        attendance: eventWithDefaults.attendance
      };
      
      if (editingEvent) {
        const updatedPastEvents = pastEvents.map((e: any) => 
          e.id === editingEvent.id ? pastEventData : e
        );
        localStorage.setItem('pastEvents', JSON.stringify(updatedPastEvents));
      } else {
        pastEvents.push(pastEventData);
        localStorage.setItem('pastEvents', JSON.stringify(pastEvents));
      }
    }
    
    loadEvents();
    setEditingEvent(null);
    window.dispatchEvent(new Event('storage'));
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleEditEvent = (event: any) => {
    // Don't allow editing past events
    if (isEventInPast(event.date, event.startTime)) {
      alert('Cannot edit past events.');
      return;
    }
    
    setEditingEvent(event);
    setShowDetailModal(false);
    if (event.type === 'gbm') {
      setShowGBMModal(true);
    } else {
      setShowEventModal(true);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event && isEventInPast(event.date, event.startTime)) {
      alert('Cannot delete past events.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this event?')) {
      // Remove from all storage locations
      ['calendarEvents', 'gbmMeetings', 'pastEvents'].forEach(key => {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = stored.filter((e: any) => e.id !== eventId);
        localStorage.setItem(key, JSON.stringify(filtered));
      });
      
      loadEvents();
      window.dispatchEvent(new Event('storage'));
    }
  };

  const getWeekDays = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const weekDays = getWeekDays();

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const jumpToDate = (date: Date | undefined) => {
    if (date) {
      setCurrentWeek(date);
      setJumpDate(date);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Calendar</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium min-w-[200px] text-center">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Jump to Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !jumpDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Jump to Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={jumpDate}
                onSelect={jumpToDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowEventModal(true)}
            className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
          <Button
            onClick={() => setShowGBMModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New GBM / Meeting
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            <div className="p-4 border-r bg-gray-50 font-medium">Time</div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-4 text-center border-r last:border-r-0 bg-gray-50">
                <div className="font-medium">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-sm text-gray-500">{day.getDate()}</div>
              </div>
            ))}
          </div>
          
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8 border-b last:border-b-0 min-h-[60px]">
              <div className="p-4 border-r bg-gray-50 text-sm font-medium">{time}</div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day);
                const timeEvents = dayEvents.filter(event => {
                  const eventStart = event.startTime?.substring(0, 5);
                  return eventStart === time;
                });

                return (
                  <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[60px]">
                    {timeEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-2 rounded text-xs cursor-pointer mb-1 relative ${
                          event.type === 'gbm' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-75">{event.location}</div>
                        <div className="text-xs opacity-75">{event.startTime} - {event.endTime}</div>
                        {event.enableRegistration && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-rotaract-orange rounded-full" 
                               title="Registration Enabled"></div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modals */}
      <EventCreationModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        onEventCreate={saveEvent}
        editData={editingEvent}
        isGBM={false}
      />

      <EventCreationModal
        isOpen={showGBMModal}
        onClose={() => {
          setShowGBMModal(false);
          setEditingEvent(null);
        }}
        onEventCreate={saveEvent}
        editData={editingEvent}
        isGBM={true}
      />

      <EnhancedEventDetailModal
        event={selectedEvent}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default WeeklyCalendar;
