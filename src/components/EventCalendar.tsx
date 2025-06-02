
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define event types
type Event = {
  id: number;
  name: string;
  date: Date;
  description: string;
  type: 'flagship' | 'csd' | 'cmd' | 'isd' | 'pdd' | 'gbm' | 'meeting';
  location?: string;
};

const EventCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  // Load GBM/Meeting events from localStorage
  useEffect(() => {
    const storedGBMs = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
    
    // Sample events data - including both regular events and GBMs
    const sampleEvents: Event[] = [
      {
        id: 1,
        name: "Blood Donation Camp (BDC)",
        date: new Date(2025, 6, 15),
        description: "Annual flagship Blood Donation Camp event at MUJ campus",
        type: 'flagship',
        location: "MUJ Main Campus"
      },
      {
        id: 2,
        name: "Daan Utsav",
        date: new Date(2025, 9, 2),
        description: "Annual donation drive for the underprivileged communities",
        type: 'flagship',
        location: "Multiple Locations"
      },
      {
        id: 3,
        name: "International Service Workshop",
        date: new Date(2025, 3, 25),
        description: "Workshop on international service opportunities",
        type: 'isd',
        location: "Virtual"
      },
      {
        id: 4,
        name: "Professional Development Seminar",
        date: new Date(2025, 5, 10),
        description: "Career development and networking seminar",
        type: 'pdd',
        location: "MUJ Auditorium"
      },
      {
        id: 5,
        name: "Community Service Initiative",
        date: new Date(2025, 8, 5),
        description: "Environmental cleanup drive",
        type: 'cmd',
        location: "Jaipur City"
      }
    ];

    // Convert stored GBMs to Event format
    const gbmEvents: Event[] = storedGBMs.map((gbm: any, index: number) => ({
      id: 1000 + index,
      name: gbm.title,
      date: new Date(gbm.date),
      description: gbm.description,
      type: gbm.type === 'gbm' ? 'gbm' : 'meeting',
      location: gbm.venue
    }));

    setEvents([...sampleEvents, ...gbmEvents]);
  }, []);

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => 
    date && 
    event.date.getDate() === date.getDate() && 
    event.date.getMonth() === date.getMonth() && 
    event.date.getFullYear() === date.getFullYear()
  );

  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
        modifiers={{
          hasEvent: isDayWithEvent
        }}
        modifiersStyles={{
          hasEvent: {
            backgroundColor: '#f59120',
            color: 'white',
            fontWeight: 'bold'
          }
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
                <div 
                  key={event.id} 
                  className="p-3 rounded-lg border border-gray-200 hover:border-rotaract-orange transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-black">{event.name}</h3>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.type === 'flagship' ? 'bg-rotaract-orange/20 text-rotaract-orange' :
                      event.type === 'gbm' || event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'csd' ? 'bg-green-100 text-green-800' :
                      event.type === 'cmd' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'isd' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.type === 'flagship' ? 'Flagship' :
                       event.type === 'gbm' ? 'GBM' :
                       event.type === 'meeting' ? 'Meeting' :
                       event.type.toUpperCase()}
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
