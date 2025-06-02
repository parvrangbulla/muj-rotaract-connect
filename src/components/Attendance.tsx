
import { useState, useEffect } from 'react';
import { Check, X, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AttendanceRecord {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  registeredMembers: string[];
  attendance: { [memberName: string]: 'present' | 'absent' | 'pending' };
}

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Load attendance data from localStorage
    const loadAttendanceData = () => {
      const storedAttendance = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      setAttendanceData(storedAttendance);
    };

    loadAttendanceData();

    // Listen for storage changes
    const handleStorageChange = () => loadAttendanceData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const markAttendance = (eventId: string, memberName: string, status: 'present' | 'absent') => {
    const updatedData = attendanceData.map(record => {
      if (record.eventId === eventId) {
        const updatedAttendance = { ...record.attendance };
        const oldStatus = updatedAttendance[memberName];
        updatedAttendance[memberName] = status;

        // Update service hours
        if (oldStatus !== status) {
          updateServiceHours(memberName, status === 'present' ? 2 : (oldStatus === 'present' ? -2 : 0));
        }

        return { ...record, attendance: updatedAttendance };
      }
      return record;
    });

    setAttendanceData(updatedData);
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedData));
  };

  const updateServiceHours = (memberName: string, hoursChange: number) => {
    // Update service hours in profile data
    const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const currentHours = profileData.serviceHours || 0;
    profileData.serviceHours = Math.max(0, currentHours + hoursChange);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // Trigger storage event for profile updates
    window.dispatchEvent(new Event('storage'));
  };

  if (attendanceData.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h2>
          <p className="text-gray-600">Track attendance for events with registration enabled</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No events with attendance tracking found.</p>
              <p className="text-sm mt-2">Events with registration enabled will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h2>
        <p className="text-gray-600">Mark attendance and manage service hours</p>
      </div>

      {attendanceData.map((record) => (
        <Card key={record.eventId}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{record.eventTitle}</CardTitle>
                <p className="text-sm text-gray-500">{record.eventDate}</p>
              </div>
              <Badge variant="outline">
                {record.registeredMembers.length} registered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {record.registeredMembers.length === 0 ? (
                <p className="text-gray-500 text-sm">No members registered for this event.</p>
              ) : (
                record.registeredMembers.map((member) => (
                  <div key={member} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{member}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={record.attendance[member] === 'present' ? 'default' : 'outline'}
                        onClick={() => markAttendance(record.eventId, member, 'present')}
                        className={record.attendance[member] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={record.attendance[member] === 'absent' ? 'destructive' : 'outline'}
                        onClick={() => markAttendance(record.eventId, member, 'absent')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Attendance;
