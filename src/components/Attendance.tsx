
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Attendance = () => {
  const [eventsWithAttendance, setEventsWithAttendance] = useState<any[]>([]);
  const [openEvents, setOpenEvents] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadEventsWithAttendance();
    const handleStorageChange = () => loadEventsWithAttendance();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadEventsWithAttendance = () => {
    const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const gbmMeetings = JSON.parse(localStorage.getItem('gbmMeetings') || '[]');
    const pastEvents = JSON.parse(localStorage.getItem('pastEvents') || '[]');
    
    const allEvents = [...calendarEvents, ...gbmMeetings, ...pastEvents];
    
    // Filter events that have attendance enabled and registered users
    const attendanceEvents = allEvents.filter(event => 
      (event.enableAttendance || event.enableRegistration) && 
      event.registeredUsers && 
      event.registeredUsers.length > 0
    );
    
    setEventsWithAttendance(attendanceEvents);
  };

  const updateAttendance = (eventId: string, userId: string, status: 'present' | 'absent') => {
    // Update in all possible storage locations
    const storageKeys = ['calendarEvents', 'gbmMeetings', 'pastEvents'];
    
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

  if (eventsWithAttendance.length === 0) {
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
        <p className="text-gray-600">Mark attendance for registered participants</p>
      </div>

      <div className="space-y-4">
        {eventsWithAttendance.map((event) => {
          const stats = getAttendanceStats(event);
          const isOpen = openEvents[event.id];
          
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
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {event.date} • {event.location}
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
                      {event.registeredUsers.map((user: any, index: number) => {
                        const userId = user.registrationNumber || user.fullName;
                        const currentStatus = event.attendance?.[userId] || 'pending';
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-sm text-gray-600">
                                {user.phoneNumber} • {user.registrationNumber}
                              </div>
                            </div>
                            
                            <Select
                              value={currentStatus}
                              onValueChange={(value) => updateAttendance(event.id, userId, value as 'present' | 'absent')}
                            >
                              <SelectTrigger className="w-32">
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
