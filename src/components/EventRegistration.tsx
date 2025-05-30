
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EventRegistration = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Mural Painting",
      date: "June 2, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Art Block",
      description: "Creative mural painting workshop for community beautification."
    },
    {
      id: 2,
      title: "Professional Development Seminar",
      date: "June 15, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "MUJ Auditorium",
      description: "Career development and networking seminar for professional growth."
    }
  ];

  const handleRegister = (eventId: number) => {
    console.log('Registering for event:', eventId);
    alert('Registration successful! Check the calendar for more details.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">Event Registration</h1>
        <p className="text-gray-600">Register for upcoming events that require pre-registration.</p>
      </div>

      <div className="grid gap-4">
        {upcomingEvents.map(event => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">📅 {event.date}</p>
                <p className="text-sm text-gray-600">🕐 {event.time}</p>
                <p className="text-sm text-gray-600">📍 {event.location}</p>
              </div>
              <p className="text-sm text-gray-700">{event.description}</p>
              <Button 
                onClick={() => handleRegister(event.id)}
                className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
              >
                Register Now
              </Button>
            </CardContent>
          </Card>
        ))}

        {upcomingEvents.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No events requiring registration at the moment.</p>
              <p className="text-sm text-gray-400 mt-2">Check back later for upcoming events!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventRegistration;
