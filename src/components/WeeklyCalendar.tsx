import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventCreationModal from './EventCreationModal';
import EnhancedEventDetailModal from './EnhancedEventDetailModal';
import EventRegistrationModal from './EventRegistrationModal';

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showGBMModal, setShowGBMModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
    const handleStorageChange = () => loadEvents();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadEvents = () => {
    const storedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const storedGBMs = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
    setEvents([...storedEvents, ...storedGBMs]);
  };

  const saveEvent = (eventData: any) => {
    const isGBM = eventData.type === 'gbm';
    const storageKey = isGBM ? 'gbmMeetings' : 'calendarEvents';
    const existingEvents = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (editingEvent) {
      const updatedEvents = existingEvents.map((e: any) => 
        e.id === editingEvent.id ? eventData : e
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
    } else {
      existingEvents.push(eventData);
      localStorage.setItem(storageKey, JSON.stringify(existingEvents));
    }
    
    // Also save to pastEvents for dashboard display
    const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
    const pastEventData = {
      id: eventData.id,
      title: eventData.title,
      date: eventData.date,
      description: eventData.description,
      category: isGBM ? 'GBM' : 'Event',
      shortDescription: eventData.description.substring(0, 100),
      venue: eventData.location,
      images: [],
      bannerUrl: '',
      galleryUrls: [],
      enableRegistration: eventData.enableRegistration,
      enableAttendance: eventData.enableAttendance,
      registeredUsers: eventData.registeredUsers || [],
      attendance: eventData.attendance || {}
    };
    
    if (editingEvent) {
      const updatedPastEvents = pastEvents.map((e: any) => 
        e.id === editingEvent.id ? pastEventData : e
      );
      localStorage.setItem('pastEvents', JSON.stringify(updatedPastEvents));
    } else {
      pastEvents.push(pastEventData);
      localStorage.setItem('pastEvents', JSON.stringify(pastEventData));
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
    setEditingEvent(event);
    setShowDetailModal(false);
    if (event.type === 'gbm') {
      setShowGBMModal(true);
    } else {
      setShowEventModal(true);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    // Remove from both storage locations
    ['calendarEvents', 'gbmMeetings', 'pastEvents'].forEach(key => {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = stored.filter((e: any) => e.id !== eventId);
      localStorage.setItem(key, JSON.stringify(filtered));
    });
    
    loadEvents();
    window.dispatchEvent(new Event('storage'));
  };

  const handleRegistration = (eventId: string, userData: any) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const registeredUsers = event.registeredUsers || [];
        return { ...event, registeredUsers: [...registeredUsers, userData] };
      }
      return event;
    });
    
    // Update storage
    const event = events.find(e => e.id === eventId);
    if (event) {
      const storageKey = event.type === 'gbm' ? 'gbmMeetings' : 'calendarEvents';
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updated = stored.map((e: any) => {
        if (e.id === eventId) {
          return { ...e, registeredUsers: [...(e.registeredUsers || []), userData] };
        }
        return e;
      });
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    
    setEvents(updatedEvents);
    alert('Registration successful!');
  };

  const handleAttendanceUpdate = (eventId: string, userId: string, status: 'present' | 'absent') => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const attendance = event.attendance || {};
        return { ...event, attendance: { ...attendance, [userId]: status } };
      }
      return event;
    });
    
    // Update storage
    const event = events.find(e => e.id === eventId);
    if (event) {
      const storageKey = event.type === 'gbm' ? 'gbmMeetings' : 'calendarEvents';
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updated = stored.map((e: any) => {
        if (e.id === eventId) {
          const attendance = e.attendance || {};
          return { ...e, attendance: { ...attendance, [userId]: status } };
        }
        return e;
      });
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    
    setEvents(updatedEvents);
  };

  const getWeekDays = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
    
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
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowEventModal(true)}
            className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
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
                        className={`p-2 rounded text-xs cursor-pointer mb-1 ${
                          event.type === 'gbm' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-75">{event.location}</div>
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
        onAttendanceUpdate={handleAttendanceUpdate}
      />

      <EventRegistrationModal
        event={selectedEvent}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onRegister={handleRegistration}
      />
    </div>
  );
};

export default WeeklyCalendar;
