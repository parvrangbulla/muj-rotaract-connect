
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import EnhancedEventDetailModal from './EnhancedEventDetailModal';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  type: 'event' | 'gbm' | 'meeting';
  showOnGuestCalendar?: boolean;
}

const GuestCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const loadEvents = () => {
      const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      const gbmMeetings = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
      
      // Combine events and filter for guest calendar
      const allEvents = [
        ...calendarEvents,
        ...gbmMeetings.filter((gbm: any) => gbm.type === 'gbm' || gbm.showOnGuestCalendar)
      ];
      
      setEvents(allEvents);
    };

    loadEvents();
    
    const handleStorageChange = () => loadEvents();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => {
    if (!selectedDate) return false;
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Check if a date has events for calendar highlighting
  const hasEvents = (date: Date) => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleEditEvent = () => {
    // Guest users cannot edit events
    alert('Please log in to edit events.');
  };

  const handleDeleteEvent = () => {
    // Guest users cannot delete events
    alert('Please log in to delete events.');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'gbm':
        return 'bg-purple-100 text-purple-800';
      case 'meeting':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'gbm':
        return 'GBM';
      case 'meeting':
        return 'Meeting';
      default:
        return 'Event';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-6 h-6 text-rotaract-orange" />
        <h2 className="text-2xl font-bold text-black">Event Calendar</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasEvents: (date) => hasEvents(date)
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: '#f97316',
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rotaract-orange rounded"></div>
                <span>Days with events</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? `Events on ${selectedDate.toLocaleDateString()}` : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No events scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge className={getEventTypeColor(event.type)}>
                        {getEventTypeLabel(event.type)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-gray-700">{event.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleEventClick(event)}
                >
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} at {event.startTime}
                    </p>
                  </div>
                  <Badge className={getEventTypeColor(event.type)}>
                    {getEventTypeLabel(event.type)}
                  </Badge>
                </div>
              ))}
            {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming events scheduled</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
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

export default GuestCalendar;
