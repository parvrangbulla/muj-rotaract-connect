
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';

interface EventDetailModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: any) => void;
  onDelete: (eventId: string) => void;
  onAttendanceUpdate: (eventId: string, userId: string, status: 'present' | 'absent') => void;
}

const EnhancedEventDetailModal = ({ 
  event, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onAttendanceUpdate 
}: EventDetailModalProps) => {
  const [enableAttendance, setEnableAttendance] = useState(event?.enableAttendance || false);

  if (!event) return null;

  const isGBM = event.type === 'gbm';
  const hasRegisteredUsers = event.registeredUsers && event.registeredUsers.length > 0;

  const handleAttendanceChange = (userId: string, status: 'present' | 'absent') => {
    onAttendanceUpdate(event.id, userId, status);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(event)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Event
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete Event
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={isGBM ? "bg-blue-600" : "bg-rotaract-orange"}>
              {isGBM ? "GBM / Meeting" : "Event"}
            </Badge>
            <span className="text-sm text-gray-500">
              {event.date} • {event.startTime} - {event.endTime}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Event Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Location:</span> {event.location}</p>
              <p><span className="font-medium">Description:</span> {event.description}</p>
            </div>
          </div>

          {/* Registration Section */}
          {event.enableRegistration && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Event Registration</h3>
              <p className="text-sm text-gray-600 mb-4">
                Registration is enabled for this event.
              </p>
              {hasRegisteredUsers ? (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Registered Participants ({event.registeredUsers.length})</h4>
                    <div className="space-y-2">
                      {event.registeredUsers.map((user: any, index: number) => (
                        <div key={index} className="p-2 border rounded-lg">
                          <div className="text-sm">
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-gray-600">Phone: {user.phoneNumber}</p>
                            <p className="text-gray-600">Reg. No: {user.registrationNumber}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-gray-500">No participants registered yet.</p>
              )}
            </div>
          )}

          {/* Attendance Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Attendance</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableAttendance"
                  checked={enableAttendance}
                  onCheckedChange={setEnableAttendance}
                />
                <Label htmlFor="enableAttendance" className="text-sm">Enable Attendance</Label>
              </div>
            </div>

            {enableAttendance && hasRegisteredUsers ? (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Mark Attendance</h4>
                  <div className="space-y-3">
                    {event.registeredUsers.map((user: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{user.fullName}</p>
                          <p className="text-xs text-gray-600">{user.registrationNumber}</p>
                        </div>
                        <Select
                          value={event.attendance?.[user.registrationNumber] || 'pending'}
                          onValueChange={(value) => handleAttendanceChange(user.registrationNumber, value as 'present' | 'absent')}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : enableAttendance && !hasRegisteredUsers ? (
              <p className="text-sm text-gray-500">No registered participants for attendance tracking.</p>
            ) : (
              <p className="text-sm text-gray-500">Enable attendance to track participant presence.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedEventDetailModal;
