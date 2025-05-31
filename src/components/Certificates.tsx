
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Award } from 'lucide-react';

interface CertificateEvent {
  id: number;
  title: string;
  date: string;
  type: 'flagship' | 'event' | 'gbm';
  attendanceStatus: 'present' | 'absent';
  certificateAvailable: boolean;
}

const Certificates = () => {
  const [certificates] = useState<CertificateEvent[]>([
    {
      id: 1,
      title: "BDC - Blood Donation Camp",
      date: "October 7, 2024",
      type: 'flagship',
      attendanceStatus: 'present',
      certificateAvailable: true
    },
    {
      id: 2,
      title: "Mural Painting Workshop",
      date: "June 2, 2025",
      type: 'event',
      attendanceStatus: 'present',
      certificateAvailable: true
    },
    {
      id: 3,
      title: "GBM - General Body Meeting",
      date: "May 31, 2025",
      type: 'gbm',
      attendanceStatus: 'absent',
      certificateAvailable: false
    }
  ]);

  const handleDownloadCertificate = (eventId: number, eventTitle: string) => {
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
                      Certificate Unavailable
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
                {presentEvents.filter(cert => cert.certificateAvailable).length}
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
