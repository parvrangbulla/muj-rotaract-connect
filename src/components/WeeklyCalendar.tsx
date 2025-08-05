
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Info } from 'lucide-react';
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
      
      const events = Array.isArray(storedEvents) ? storedEvents : [];
      const gbms = Array.isArray(storedGBMs) ? storedGBMs : [];
      
      // Show all events, including past ones
      const allEvents = [...events, ...gbms];
      
      setEvents(allEvents);
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
    const isPastEvent = isEventInPast(eventData.date, eventData.startTime);
    
    if (isPastEvent && !editingEvent) {
      alert('Cannot schedule events in the past. Please select a future date and time.');
      return;
    }

    const isGBM = eventData.type === 'gbm' || eventData.type === 'meeting';
    const eventWithDefaults = {
      ...eventData,
      id: editingEvent?.id || Date.now().toString(),
      type: eventData.type, // Keep the exact type (gbm, meeting, or event)
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      registeredUsers: editingEvent?.registeredUsers || [],
      attendance: editingEvent?.attendance || {},
      enableRegistration: editingEvent?.enableRegistration || false,
      enableAttendance: editingEvent?.enableAttendance || false,
      meetingMinutes: editingEvent?.meetingMinutes || '',
      showOnGuestCalendar: eventData.type === 'gbm' || eventData.eventCategory === 'gbm'
    };

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
    
    loadEvents();
    setEditingEvent(null);
    window.dispatchEvent(new Event('storage'));
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleEditEvent = (event: any) => {
    if (isEventInPast(event.date, event.startTime)) {
      alert('Cannot edit past events.');
      return;
    }
    
    setEditingEvent(event);
    setShowDetailModal(false);
    if (event.type === 'gbm' || event.type === 'meeting') {
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
      ['calendarEvents', 'gbmMeetings'].forEach(key => {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = stored.filter((e: any) => e.id !== eventId);
        localStorage.setItem(key, JSON.stringify(filtered));
      });
      
      loadEvents();
      setShowDetailModal(false);
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
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
    '20:00', '21:00', '22:00', '23:00', '00:00'
  ];

  const weekDays = getWeekDays();

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.max(60, diffInMinutes); // Minimum 1 hour
  };

  const getEventPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);
    
    const startOffset = (startHour - 10) * 60 + startMinute;
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
    
    return {
      top: (startOffset / 60) * 60, // 60px per hour
      height: Math.max(30, (duration / 60) * 60) // Minimum 30px height
    };
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

  const getEventColor = (event: any) => {
    const isPast = isEventInPast(event.date, event.startTime);
    const opacity = isPast ? 'opacity-60' : '';
    
    if (event.type === 'gbm') {
      return `bg-purple-100 border-purple-500 text-purple-800 hover:bg-purple-200 ${opacity}`;
    } else if (event.type === 'meeting') {
      return `bg-indigo-100 border-indigo-500 text-indigo-800 hover:bg-indigo-200 ${opacity}`;
    } else if (event.eventCategory === 'working-team') {
      return `bg-orange-100 border-orange-500 text-orange-800 hover:bg-orange-200 ${opacity}`;
    } else {
      return `bg-green-100 border-green-500 text-green-800 hover:bg-green-200 ${opacity}`;
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

          {/* Color Legend */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="w-4 h-4 mr-2" />
                Legend
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-3">Event Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-100 border-l-4 border-purple-500 rounded-sm"></div>
                    <span className="text-sm">GBM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-100 border-l-4 border-indigo-500 rounded-sm"></div>
                    <span className="text-sm">Meeting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border-l-4 border-orange-500 rounded-sm"></div>
                    <span className="text-sm">Working Team Event</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded-sm"></div>
                    <span className="text-sm">GBM Event</span>
                  </div>
                </div>
              </div>
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

      {/* Calendar Grid - Teams Style */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b bg-gray-50">
            <div className="p-3 border-r font-medium text-sm">Time</div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-3 text-center border-r last:border-r-0">
                <div className="font-medium text-sm">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-lg font-semibold text-gray-700">{day.getDate()}</div>
              </div>
            ))}
          </div>
          
          {/* Time Grid */}
          <div className="relative">
            {timeSlots.map((time, timeIndex) => (
              <div key={timeIndex} className="grid grid-cols-8 border-b last:border-b-0" style={{ height: '60px' }}>
                <div className="p-3 border-r bg-gray-50 text-xs font-medium text-gray-600 flex items-start">
                  {time}
                </div>
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="border-r last:border-r-0 relative" style={{ height: '60px' }}>
                    {/* Time slot background */}
                  </div>
                ))}
              </div>
            ))}
            
            {/* Event Overlays */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              
              return (
                <div key={dayIndex} className="absolute inset-0">
                  <div className="grid grid-cols-8 h-full">
                    {/* Skip time column */}
                    <div></div>
                    {weekDays.map((_, colIndex) => {
                      if (colIndex !== dayIndex) return <div key={colIndex}></div>;
                      
                      return (
                        <div key={colIndex} className="relative border-r last:border-r-0">
                          {dayEvents.map((event) => {
                            const position = getEventPosition(event.startTime, event.endTime);
                            
                            return (
                              <div
                                key={event.id}
                                className={`absolute left-1 right-1 rounded-md cursor-pointer shadow-sm border-l-4 z-10 ${getEventColor(event)}`}
                                style={{
                                  top: `${position.top}px`,
                                  height: `${position.height}px`
                                }}
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="p-2 h-full flex flex-col justify-between">
                                  <div>
                                    <div className="font-medium text-xs truncate">{event.title}</div>
                                    <div className="text-xs opacity-75 truncate">{event.location}</div>
                                  </div>
                                  <div className="text-xs opacity-75">{event.startTime} - {event.endTime}</div>
                                  {event.enableRegistration && (
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-rotaract-orange rounded-full" 
                                         title="Registration Enabled"></div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
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
