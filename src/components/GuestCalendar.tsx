
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import EnhancedEventDetailModal from './EnhancedEventDetailModal';
import { eventService } from '@/services/event.service';
import { toast } from 'sonner';

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
  eventCategory?: 'working-team' | 'gbm';
}

const GuestCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    console.log('GuestCalendar: Component mounted, loading events...');
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      console.log('GuestCalendar: Loading events...');
      const events = await eventService.getCalendarEvents();
      console.log('GuestCalendar: All events loaded:', events);
      
      // Filter events that should be visible to guests
      // Show GBM events, meetings, and any events explicitly marked for guest visibility
      const guestVisibleEvents = events.filter(event => {
        const isVisible = event.showOnGuestCalendar || 
                         event.type === 'gbm' || 
                         event.type === 'meeting' ||
                         event.enableRegistration; // Show events where registration is enabled
        
        console.log(`Event "${event.title}": showOnGuestCalendar=${event.showOnGuestCalendar}, type=${event.type}, enableRegistration=${event.enableRegistration}, visible=${isVisible}`);
        
        return isVisible;
      });
      
      console.log('GuestCalendar: Guest visible events:', guestVisibleEvents);
      setEvents(guestVisibleEvents);
    } catch (error) {
      console.error('GuestCalendar: Error loading events:', error);
      toast.error('Failed to load events');
      setEvents([]);
    }
  };

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
    // For working team events, don't show popup in guest mode
    if (event.eventCategory === 'working-team') {
      return; // No action for working team events
    }
    
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

  const getEventTypeColor = (type: string, eventCategory?: string) => {
    if (type === 'gbm') {
      return 'bg-purple-100 text-purple-800';
    } else if (type === 'meeting') {
      return 'bg-indigo-100 text-indigo-800';
    } else if (eventCategory === 'working-team') {
      return 'bg-orange-100 text-orange-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  const getEventTypeLabel = (type: string, eventCategory?: string) => {
    if (type === 'gbm') {
      return 'GBM';
    } else if (type === 'meeting') {
      return 'Meeting';
    } else if (eventCategory === 'working-team') {
      return 'Working Team';
    } else {
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
                    className={`border border-gray-200 rounded-lg p-4 transition-shadow ${
                      event.eventCategory === 'working-team' ? '' : 'hover:shadow-md cursor-pointer'
                    }`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge className={getEventTypeColor(event.type, event.eventCategory)}>
                        {getEventTypeLabel(event.type, event.eventCategory)}
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
                    
                    {event.eventCategory === 'working-team' && (
                      <p className="mt-2 text-xs text-gray-500 italic">Contact organizers for more details</p>
                    )}
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
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors ${
                    event.eventCategory === 'working-team' ? '' : 'cursor-pointer hover:bg-gray-100'
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} at {event.startTime}
                    </p>
                  </div>
                  <Badge className={getEventTypeColor(event.type, event.eventCategory)}>
                    {getEventTypeLabel(event.type, event.eventCategory)}
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
        isGuestMode={true}
      />
    </div>
  );
};

export default GuestCalendar;
