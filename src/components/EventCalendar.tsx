
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define event types
type Event = {
  id: number | string;
  name: string;
  date: Date;
  description: string;
  type: 'flagship' | 'csd' | 'cmd' | 'isd' | 'pdd' | 'gbm';
  location?: string;
  time?: string;
  venue?: string;
};

const EventCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [gbmEvents, setGbmEvents] = useState<Event[]>([]);

  // Load GBM events from localStorage
  useEffect(() => {
    const savedGBMs = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
    const formattedGBMs = savedGBMs.map((gbm: any) => ({
      id: gbm.id,
      name: gbm.title,
      date: new Date(gbm.date),
      description: gbm.description,
      type: 'gbm' as const,
      location: gbm.venue,
      time: gbm.time,
      venue: gbm.venue
    }));
    setGbmEvents(formattedGBMs);
  }, []);

  // Sample events data - would be replaced with actual data
  const sampleEvents: Event[] = [
    {
      id: 1,
      name: "Blood Donation Camp (BDC)",
      date: new Date(2025, 6, 15), // July 15, 2025
      description: "Annual flagship Blood Donation Camp event at MUJ campus",
      type: 'flagship',
      location: "MUJ Main Campus"
    },
    {
      id: 2,
      name: "Daan Utsav",
      date: new Date(2025, 9, 2), // October 2, 2025
      description: "Annual donation drive for the underprivileged communities",
      type: 'flagship',
      location: "Multiple Locations"
    },
    {
      id: 3,
      name: "International Service Workshop",
      date: new Date(2025, 3, 25), // April 25, 2025
      description: "Workshop on international service opportunities",
      type: 'isd',
      location: "Virtual"
    },
    {
      id: 4,
      name: "Professional Development Seminar",
      date: new Date(2025, 5, 10), // June 10, 2025
      description: "Career development and networking seminar",
      type: 'pdd',
      location: "MUJ Auditorium"
    },
    {
      id: 5,
      name: "Community Service Initiative",
      date: new Date(2025, 8, 5), // September 5, 2025
      description: "Environmental cleanup drive",
      type: 'cmd',
      location: "Jaipur City"
    }
  ];

  // Combine sample events with GBM events
  const allEvents = [...sampleEvents, ...gbmEvents];

  // Filter events for the selected date
  const selectedDateEvents = allEvents.filter(event => 
    date && 
    event.date.getDate() === date.getDate() && 
    event.date.getMonth() === date.getMonth() && 
    event.date.getFullYear() === date.getFullYear()
  );

  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return allEvents.some(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'flagship': return 'bg-rotaract-orange/20 text-rotaract-orange';
      case 'csd': return 'bg-green-100 text-green-800';
      case 'cmd': return 'bg-blue-100 text-blue-800';
      case 'isd': return 'bg-purple-100 text-purple-800';
      case 'pdd': return 'bg-red-100 text-red-800';
      case 'gbm': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'flagship': return 'Flagship';
      case 'gbm': return 'GBM/Meeting';
      default: return type.toUpperCase();
    }
  };

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        modifiers={{
          hasEvent: isDayWithEvent
        }}
        modifiersStyles={{
          hasEvent: { backgroundColor: '#f97316', color: 'white' }
        }}
      />
      
      {selectedDateEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-black">
              Events on {date?.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="p-3 rounded-lg border border-gray-200 hover:border-rotaract-orange transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-black">{event.name}</h3>
                      <p className="text-xs text-gray-500">
                        {event.location || event.venue}
                        {event.time && ` • ${event.time}`}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                      {getEventTypeLabel(event.type)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">{event.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventCalendar;
