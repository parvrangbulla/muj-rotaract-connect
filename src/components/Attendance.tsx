
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Users, Download, Search, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { eventService } from '@/services/event.service';
import { toast } from 'sonner';

const Attendance = () => {
  const { isExecutive } = useAuth();
  const [eventsWithAttendance, setEventsWithAttendance] = useState<any[]>([]);
  const [openEvents, setOpenEvents] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Role-based access control
  if (!isExecutive) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Access Denied. This feature is only available for Executive members.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  useEffect(() => {
    loadEventsWithAttendance();
  }, []);

  const loadEventsWithAttendance = async () => {
    try {
      console.log('Attendance: Loading events with registrations from Firebase...');
      
      // Load all events from Firebase
      const allEvents = await eventService.getCalendarEvents();
      console.log('Attendance: All events loaded:', allEvents);
      
      // Filter events that have registrations OR attendance records
      const attendanceEvents = allEvents.filter(event => 
        (event.registeredUsers && event.registeredUsers.length > 0) || 
        (event.attendance && Object.keys(event.attendance).length > 0) ||
        event.type === 'gbm' || event.type === 'meeting' // Always show GBM/Meetings for attendance
      );
      
      console.log('Attendance: Events with registrations:', attendanceEvents);
      setEventsWithAttendance(attendanceEvents);
    } catch (error) {
      console.error('Attendance: Error loading events:', error);
      toast.error('Failed to load events for attendance');
      setEventsWithAttendance([]);
    }
  };

  const updateAttendance = async (eventId: string, userId: string, status: 'present' | 'absent') => {
    try {
      // Find the event to check if it's a GBM and if attendance is already marked
      const event = eventsWithAttendance.find(e => e.id === eventId);
      if (event && event.type === 'gbm' && event.attendance && event.attendance[userId]) {
        // For GBMs, if attendance is already marked, don't allow changes
        toast.error('Attendance for GBM/Meeting participants cannot be modified once marked.');
        return;
      }

      console.log(`Attendance: Updating attendance for event ${eventId}, user ${userId} to ${status}`);

      // Get current attendance data
      const currentAttendance = event?.attendance || {};
      const updatedAttendance = { ...currentAttendance, [userId]: status };

      // Update the event in Firebase
      await eventService.updateEvent(eventId, {
        attendance: updatedAttendance
      });

      console.log('Attendance: Attendance updated successfully in Firebase');
      toast.success(`Attendance marked as ${status}`);

      // Reload events to get updated data
      await loadEventsWithAttendance();
    } catch (error) {
      console.error('Attendance: Error updating attendance:', error);
      toast.error('Failed to update attendance');
    }
  };

  const addManualParticipant = async (eventId: string) => {
    const name = prompt('Enter participant name:');
    const regNumber = prompt('Enter registration number:');
    const phone = prompt('Enter phone number:');
    
    if (name && regNumber && phone) {
      try {
        const newParticipant = {
          fullName: name,
          registrationNumber: regNumber,
          phoneNumber: phone,
          registeredAt: new Date().toISOString(),
          manuallyAdded: true
        };

        console.log(`Attendance: Adding manual participant ${name} to event ${eventId}`);

        // Get current registered users
        const event = eventsWithAttendance.find(e => e.id === eventId);
        const currentRegisteredUsers = event?.registeredUsers || [];
        const updatedRegisteredUsers = [...currentRegisteredUsers, newParticipant];

        // Update the event in Firebase
        await eventService.updateEvent(eventId, {
          registeredUsers: updatedRegisteredUsers
        });

        console.log('Attendance: Manual participant added successfully to Firebase');
        toast.success('Participant added successfully');

        // Reload events to get updated data
        await loadEventsWithAttendance();
      } catch (error) {
        console.error('Attendance: Error adding manual participant:', error);
        toast.error('Failed to add participant');
      }
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
    const registeredUsers = event.registeredUsers || [];
    const attendance = event.attendance || {};
    
    // For GBM events, count all registered users and mark them as pending if no attendance
    if (event.type === 'gbm' || event.type === 'meeting') {
      const totalUsers = registeredUsers.length;
      const present = Object.values(attendance).filter(status => status === 'present').length;
      const absent = Object.values(attendance).filter(status => status === 'absent').length;
      const pending = totalUsers - present - absent; // Pending = registered but no attendance marked
      
      return { totalUsers, present, absent, pending };
    }
    
    // For regular events, count based on registrations
    const totalUsers = registeredUsers.length;
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
                      
                      {/* Show participants from registrations */}
                      {event.registeredUsers && event.registeredUsers.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Registered Participants</h5>
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
                                
                                {isAttendanceMarked ? (
                                  <Badge 
                                    className={`${
                                      currentStatus === 'present' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-red-600 text-white'
                                    }`}
                                  >
                                    {currentStatus === 'present' ? 'Present' : 'Absent'}
                                  </Badge>
                                ) : (
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
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Show participants from attendance records (especially for GBM events) */}
                      {event.attendance && Object.keys(event.attendance).length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">
                            {isGBM ? 'Attendance Records' : 'Additional Attendance'}
                          </h5>
                          {Object.entries(event.attendance).map(([userId, status]) => {
                            // Skip if this user is already shown in registered users
                            if (event.registeredUsers?.some((user: any) => 
                              (user.registrationNumber || user.fullName) === userId
                            )) {
                              return null;
                            }
                            
                            return (
                              <div key={userId} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                <div className="flex-1">
                                  <div className="font-medium">{userId}</div>
                                  <div className="text-sm text-gray-600">
                                    {isGBM ? 'Direct Attendance Marking' : 'Manual Entry'}
                                  </div>
                                </div>
                                
                                <Badge 
                                  className={`${
                                    status === 'present' 
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-red-600 text-white'
                                  }`}
                                >
                                  {status === 'present' ? 'Present' : 'Absent'}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Show message if no participants */}
                      {(!event.registeredUsers || event.registeredUsers.length === 0) && 
                       (!event.attendance || Object.keys(event.attendance).length === 0) && (
                        <div className="text-center text-gray-500 py-4">
                          <p>No participants or attendance records yet.</p>
                          {!isGBM && (
                            <p className="text-sm mt-1">Use "Add Participant" to add people manually.</p>
                          )}
                        </div>
                      )}
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
