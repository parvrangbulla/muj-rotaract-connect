
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Users, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Attendance = () => {
  const [eventsWithAttendance, setEventsWithAttendance] = useState<any[]>([]);
  const [openEvents, setOpenEvents] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEventsWithAttendance();
    const handleStorageChange = () => loadEventsWithAttendance();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadEventsWithAttendance = () => {
    // Only load from calendar events and GBM meetings (not past events)
    const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const gbmMeetings = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
    
    const allEvents = [...calendarEvents, ...gbmMeetings];
    
    // Show all scheduled events in attendance (both future and past)
    const attendanceEvents = allEvents.filter(event => 
      event.registeredUsers && event.registeredUsers.length > 0
    );
    
    setEventsWithAttendance(attendanceEvents);
  };

  const updateAttendance = (eventId: string, userId: string, status: 'present' | 'absent') => {
    // Find the event to check if it's a GBM and if attendance is already marked
    const event = eventsWithAttendance.find(e => e.id === eventId);
    if (event && event.type === 'gbm' && event.attendance && event.attendance[userId]) {
      // For GBMs, if attendance is already marked, don't allow changes
      alert('Attendance for GBM/Meeting participants cannot be modified once marked.');
      return;
    }

    // Update in calendar storage locations only
    const storageKeys = ['calendarEvents', 'gbmMeetings'];
    
    storageKeys.forEach(key => {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = stored.map((event: any) => {
        if (event.id === eventId) {
          const attendance = event.attendance || {};
          return { ...event, attendance: { ...attendance, [userId]: status } };
        }
        return event;
      });
      localStorage.setItem(key, JSON.stringify(updated));
    });

    loadEventsWithAttendance();
    window.dispatchEvent(new Event('storage'));
  };

  const addManualParticipant = (eventId: string) => {
    const name = prompt('Enter participant name:');
    const regNumber = prompt('Enter registration number:');
    const phone = prompt('Enter phone number:');
    
    if (name && regNumber && phone) {
      const newParticipant = {
        fullName: name,
        registrationNumber: regNumber,
        phoneNumber: phone,
        registeredAt: new Date().toISOString(),
        manuallyAdded: true
      };

      const storageKeys = ['calendarEvents', 'gbmMeetings'];
      storageKeys.forEach(key => {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = stored.map((event: any) => {
          if (event.id === eventId) {
            const registeredUsers = event.registeredUsers || [];
            return { ...event, registeredUsers: [...registeredUsers, newParticipant] };
          }
          return event;
        });
        localStorage.setItem(key, JSON.stringify(updated));
      });

      loadEventsWithAttendance();
      window.dispatchEvent(new Event('storage'));
    }
  };

  const exportToCSV = (event: any) => {
    const csvContent = [
      ['Name', 'Registration Number', 'Phone', 'Status'],
      ...event.registeredUsers.map((user: any) => [
        user.fullName,
        user.registrationNumber,
        user.phoneNumber,
        event.attendance?.[user.registrationNumber] || 'pending'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title}_attendance.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleEventOpen = (eventId: string) => {
    setOpenEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const getAttendanceStats = (event: any) => {
    const totalUsers = event.registeredUsers?.length || 0;
    const attendance = event.attendance || {};
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const pending = totalUsers - present - absent;
    
    return { totalUsers, present, absent, pending };
  };

  const filteredEvents = eventsWithAttendance.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.registeredUsers?.some((user: any) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (eventsWithAttendance.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h2>
          <p className="text-gray-600">Track attendance for scheduled events with registrations</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No scheduled events with registrations found.</p>
              <p className="text-sm mt-2">Events created in the calendar with registrations will appear here.</p>
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
        <p className="text-gray-600">Mark attendance for registered participants in scheduled events</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by event name, participant name, or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const stats = getAttendanceStats(event);
          const isOpen = openEvents[event.id];
          const isGBM = event.type === 'gbm';
          
          return (
            <Card key={event.id}>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleEventOpen(event.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isOpen ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {event.title}
                            {event.type === 'gbm' && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">GBM</span>
                            )}
                            {event.enableRegistration && (
                              <span className="text-xs bg-rotaract-orange/20 text-rotaract-orange px-2 py-1 rounded">Registration Enabled</span>
                            )}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {event.date} • {event.startTime} - {event.endTime} • {event.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{stats.present}</div>
                          <div className="text-gray-500">Present</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">{stats.absent}</div>
                          <div className="text-gray-500">Absent</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-600">{stats.pending}</div>
                          <div className="text-gray-500">Pending</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{stats.totalUsers}</div>
                          <div className="text-gray-500">Total</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Participants</h4>
                        <div className="flex gap-2">
                          {!isGBM && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addManualParticipant(event.id)}
                            >
                              Add Participant
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportToCSV(event)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                          </Button>
                        </div>
                      </div>
                      
                      {event.registeredUsers.map((user: any, index: number) => {
                        const userId = user.registrationNumber || user.fullName;
                        const currentStatus = event.attendance?.[userId] || 'pending';
                        const isAttendanceMarked = isGBM && event.attendance && event.attendance[userId];
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-sm text-gray-600">
                                {user.phoneNumber} • {user.registrationNumber}
                                {user.manuallyAdded && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Manually Added
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <Select
                              value={currentStatus}
                              onValueChange={(value) => updateAttendance(event.id, userId, value as 'present' | 'absent')}
                              disabled={isAttendanceMarked}
                            >
                              <SelectTrigger className={`w-32 ${isAttendanceMarked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  <span className="text-gray-600">Pending</span>
                                </SelectItem>
                                <SelectItem value="present">
                                  <span className="text-green-600">Present</span>
                                </SelectItem>
                                <SelectItem value="absent">
                                  <span className="text-red-600">Absent</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;
