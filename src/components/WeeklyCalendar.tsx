
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  description: string;
  type: 'event' | 'gbm';
  location?: string;
}

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    registrationNumber: ''
  });

  const events: Event[] = [
    {
      id: 1,
      title: "Blood Donation Camp",
      date: new Date(2025, 0, 15),
      time: "10:00 AM",
      description: "Annual flagship Blood Donation Camp event at MUJ campus. Help save lives by donating blood.",
      type: 'event',
      location: "MUJ Main Campus"
    },
    {
      id: 2,
      title: "General Body Meeting",
      date: new Date(2025, 0, 10),
      time: "5:00 PM",
      description: "Monthly general body meeting to discuss upcoming events and club activities.",
      type: 'gbm',
      location: "Conference Room A"
    },
    {
      id: 3,
      title: "Professional Development Seminar",
      date: new Date(2025, 0, 18),
      time: "2:00 PM",
      description: "Career development and networking seminar for professional growth.",
      type: 'event',
      location: "MUJ Auditorium"
    }
  ];

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', registrationData);
    alert('Registration successful!');
    setShowRegisterForm(false);
    setRegistrationData({ name: '', registrationNumber: '' });
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold text-black">
          {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <Button variant="outline" size="sm" onClick={handleNextWeek}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = new Date().toDateString() === day.toDateString();
          
          return (
            <div 
              key={index}
              className={`min-h-32 p-2 border rounded-lg ${
                isToday ? 'bg-rotaract-orange/10 border-rotaract-orange' : 'bg-white border-gray-200'
              }`}
            >
              <div className="text-center mb-2">
                <div className="text-sm font-medium text-gray-600">{dayNames[index]}</div>
                <div className={`text-lg font-bold ${isToday ? 'text-rotaract-orange' : 'text-black'}`}>
                  {day.getDate()}
                </div>
              </div>
              
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="p-1 rounded text-xs cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Badge 
                      variant={event.type === 'gbm' ? 'secondary' : 'default'}
                      className={`w-full text-center ${
                        event.type === 'gbm' 
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                          : 'bg-rotaract-orange text-white hover:bg-rotaract-orange/80'
                      }`}
                    >
                      {event.title}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">{event.time}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Badge variant={selectedEvent.type === 'gbm' ? 'secondary' : 'default'}>
                  {selectedEvent.type === 'gbm' ? 'General Body Meeting' : 'Event'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {selectedEvent.date.toLocaleDateString()} at {selectedEvent.time}
                </p>
                {selectedEvent.location && (
                  <p className="text-sm text-gray-600">📍 {selectedEvent.location}</p>
                )}
              </div>
              <p className="text-sm">{selectedEvent.description}</p>
              
              {selectedEvent.type === 'event' && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowRegisterForm(true)}
                    className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Register for Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Registration Form Dialog */}
      <Dialog open={showRegisterForm} onOpenChange={setShowRegisterForm}>
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
                className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
              >
                Submit Registration
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowRegisterForm(false)}
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
