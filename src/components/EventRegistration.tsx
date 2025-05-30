
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';

interface EventRegistrationProps {
  eventTitle: string;
  eventDate: string;
  onCertificateDownload: (eventTitle: string, attendeeName: string, eventDate: string) => void;
}

const EventRegistration = ({ eventTitle, eventDate, onCertificateDownload }: EventRegistrationProps) => {
  const [attendeeName, setAttendeeName] = useState('');

  const handleDownloadCertificate = () => {
    if (attendeeName.trim()) {
      onCertificateDownload(eventTitle, attendeeName, eventDate);
    }
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-medium">Download Certificate</h3>
      <div>
        <Label htmlFor="attendeeName">Your Full Name</Label>
        <Input
          id="attendeeName"
          value={attendeeName}
          onChange={(e) => setAttendeeName(e.target.value)}
          placeholder="Enter your full name for certificate"
        />
      </div>
      <Button 
        onClick={handleDownloadCertificate}
        disabled={!attendeeName.trim()}
        className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Certificate
      </Button>
    </div>
  );
};

export default EventRegistration;
