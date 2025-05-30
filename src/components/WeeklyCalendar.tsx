
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';
import EventRegistration from './EventRegistration';

interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  duration: number;
  description: string;
}

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '09:00',
    duration: 1,
    description: ''
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const getWeekDays = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const weekRange = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.startTime) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: newEvent.date,
        startTime: newEvent.startTime,
        duration: newEvent.duration,
        description: newEvent.description
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', date: '', startTime: '09:00', duration: 1, description: '' });
      setIsNewEventOpen(false);
    }
  };

  const getEventsForSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.date === dateStr && event.startTime === time
    );
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const generateCertificate = (eventTitle: string, attendeeName: string, eventDate: string) => {
    // Simple certificate generation - in a real app, you'd use a PDF library
    const certificateData = `
      CERTIFICATE OF PARTICIPATION
      
      This is to certify that
      ${attendeeName}
      
      has successfully participated in
      ${eventTitle}
      
      Date: ${new Date(eventDate).toLocaleDateString()}
      
      Rotaract Club MUJ
    `;
    
    const blob = new Blob([certificateData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle.replace(/\s+/g, '_')}_Certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold">{weekRange}</h2>
          <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rotaract-orange hover:bg-rotaract-orange/90">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label htmlFor="date">Event Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Select value={newEvent.startTime} onValueChange={(value) => setNewEvent({...newEvent, startTime: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Select value={newEvent.duration.toString()} onValueChange={(value) => setNewEvent({...newEvent, duration: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(hour => (
                      <SelectItem key={hour} value={hour.toString()}>{hour} hour{hour > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                />
              </div>
              <Button onClick={handleCreateEvent} className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 gap-0">
            {/* Time column */}
            <div className="border-r">
              <div className="h-12 border-b flex items-center justify-center font-medium bg-gray-50">
                Time
              </div>
              {timeSlots.map(time => (
                <div key={time} className="h-16 border-b flex items-center justify-center text-sm font-medium">
                  {time}
                </div>
              ))}
            </div>
            
            {/* Day columns */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="border-r last:border-r-0">
                <div className="h-12 border-b flex flex-col items-center justify-center font-medium bg-gray-50">
                  <div className="text-xs text-gray-600">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-sm">
                    {day.getDate()}
                  </div>
                </div>
                {timeSlots.map(time => {
                  const slotEvents = getEventsForSlot(day, time);
                  return (
                    <div key={time} className="h-16 border-b p-1">
                      {slotEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className="bg-rotaract-orange text-white text-xs p-1 rounded cursor-pointer hover:bg-rotaract-orange/90 transition-colors"
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
      <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.startTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{selectedEvent.duration} hour{selectedEvent.duration > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{selectedEvent.description}</p>
                </div>
                <EventRegistration 
                  eventTitle={selectedEvent.title}
                  eventDate={selectedEvent.date}
                  onCertificateDownload={generateCertificate}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyCalendar;
