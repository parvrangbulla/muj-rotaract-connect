
import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface GBMData {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  type: string;
  createdAt: string;
}

const GBMManagement = () => {
  const navigate = useNavigate();
  const [gbmMeetings, setGbmMeetings] = useState<GBMData[]>([]);

  // Load GBM meetings from localStorage
  useEffect(() => {
    const loadGBMs = () => {
      const storedGBMs = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
      setGbmMeetings(storedGBMs);
    };

    loadGBMs();

    // Listen for storage changes
    const handleStorageChange = () => loadGBMs();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">GBM & Meetings</h2>
          <p className="text-gray-600">Schedule and manage General Body Meetings</p>
        </div>
        <Button
          onClick={() => navigate('/admin/gbm')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New GBM / Meeting
        </Button>
      </div>

      {gbmMeetings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">No meetings scheduled</p>
              <p className="text-sm mb-4">Create your first GBM or meeting to get started.</p>
              <Button
                onClick={() => navigate('/admin/gbm')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Schedule Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gbmMeetings.map((meeting) => (
            <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {meeting.type?.toUpperCase() || 'MEETING'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(meeting.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(meeting.time)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {meeting.venue}
                  </div>
                  <p className="text-sm text-gray-700 mt-3">
                    {meeting.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GBMManagement;
