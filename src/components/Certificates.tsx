
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Award } from 'lucide-react';

interface CertificateEvent {
  id: string;
  title: string;
  date: string;
  type: 'flagship' | 'event' | 'gbm';
  attendanceStatus?: 'present' | 'absent';
  certificateAvailable: boolean;
  enableCertificate?: boolean;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<CertificateEvent[]>([]);

  useEffect(() => {
    loadCertificates();
    const handleStorageChange = () => loadCertificates();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadCertificates = () => {
    // Load events from all storage locations
    const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const gbmMeetings = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
    const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
    
    const allEvents = [...calendarEvents, ...gbmMeetings, ...pastEvents];
    
    // Filter events that have registrations and check attendance
    const eventsWithCertificates = allEvents
      .filter(event => event.registeredUsers && event.registeredUsers.length > 0)
      .map(event => {
        const attendance = event.attendance || {};
        
        // For now, simulate a user checking their own attendance
        // In a real app, this would be based on the logged-in user
        const userAttendance = Object.values(attendance);
        const hasPresent = userAttendance.includes('present');
        
        // Properly type the event type
        let eventType: 'flagship' | 'event' | 'gbm' = 'event';
        if (event.type === 'gbm') {
          eventType = 'gbm';
        } else if (event.type === 'flagship') {
          eventType = 'flagship';
        }
        
        return {
          id: event.id,
          title: event.title,
          date: event.date,
          type: eventType,
          attendanceStatus: hasPresent ? 'present' as const : 'absent' as const,
          certificateAvailable: hasPresent && (event.enableCertificate !== false),
          enableCertificate: event.enableCertificate
        };
      });

    setCertificates(eventsWithCertificates);
  };

  const handleDownloadCertificate = (eventId: string, eventTitle: string) => {
    // In a real application, this would generate and download a PDF certificate
    console.log(`Downloading certificate for event ${eventId}: ${eventTitle}`);
    
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#'; // In real app, this would be the certificate PDF URL
    link.download = `${eventTitle.replace(/\s+/g, '_')}_Certificate.pdf`;
    link.click();
    
    alert(`Certificate for "${eventTitle}" would be downloaded as PDF`);
  };

  const presentEvents = certificates.filter(cert => cert.attendanceStatus === 'present');
  const availableCertificates = presentEvents.filter(cert => cert.certificateAvailable);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Award className="w-6 h-6 text-rotaract-orange" />
        <h2 className="text-2xl font-bold text-black">Your Certificates</h2>
      </div>
      
      {presentEvents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Certificates Available</h3>
            <p className="text-gray-500">
              Attend events and mark your attendance to earn certificates!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {presentEvents.map((cert) => (
            <Card key={cert.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <p className="text-sm text-gray-600">{cert.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${
                        cert.type === 'flagship' ? 'bg-rotaract-orange' :
                        cert.type === 'gbm' ? 'bg-blue-600' : 'bg-green-600'
                      } text-white`}
                    >
                      {cert.type === 'flagship' ? 'Flagship' : 
                       cert.type === 'gbm' ? 'GBM' : 'Event'}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      ✅ Present
                    </Badge>
                    {cert.enableCertificate === false && (
                      <Badge variant="secondary">
                        Certificate Disabled
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Certificate of Participation
                  </div>
                  {cert.certificateAvailable ? (
                    <Button
                      onClick={() => handleDownloadCertificate(cert.id, cert.title)}
                      className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                  ) : (
                    <Button disabled size="sm" variant="outline">
                      {cert.enableCertificate === false ? 'Certificate Disabled' : 'Certificate Unavailable'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Certificate Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-rotaract-orange">
                {presentEvents.length}
              </div>
              <div className="text-sm text-gray-600">Events Attended</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {availableCertificates.length}
              </div>
              <div className="text-sm text-gray-600">Certificates Available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates;
