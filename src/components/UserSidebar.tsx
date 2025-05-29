
import { useState } from 'react';
import { Calendar, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventCalendar from './EventCalendar';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'registration'>('calendar');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative ml-auto w-full max-w-md bg-white shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-rotaract-orange text-white p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="bg-gray-100 p-2 flex">
            <Button
              variant={activeTab === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 mr-2 ${
                activeTab === 'calendar' 
                  ? 'bg-rotaract-orange text-white' 
                  : 'text-gray-600 hover:text-rotaract-orange'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={activeTab === 'registration' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('registration')}
              className={`flex-1 ${
                activeTab === 'registration' 
                  ? 'bg-rotaract-orange text-white' 
                  : 'text-gray-600 hover:text-rotaract-orange'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Register
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'calendar' && (
              <div>
                <EventCalendar />
              </div>
            )}

            {activeTab === 'registration' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Event Registration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border border-gray-200 rounded-lg hover:border-rotaract-orange transition-colors">
                        <h3 className="font-semibold text-black">Blood Donation Camp</h3>
                        <p className="text-sm text-gray-600">July 15, 2025</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
                        >
                          Register Now
                        </Button>
                      </div>
                      
                      <div className="p-3 border border-gray-200 rounded-lg hover:border-rotaract-orange transition-colors">
                        <h3 className="font-semibold text-black">Daan Utsav</h3>
                        <p className="text-sm text-gray-600">October 2, 2025</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
                        >
                          Register Now
                        </Button>
                      </div>
                      
                      <div className="p-3 border border-gray-200 rounded-lg hover:border-rotaract-orange transition-colors">
                        <h3 className="font-semibold text-black">Professional Development Seminar</h3>
                        <p className="text-sm text-gray-600">June 10, 2025</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
                        >
                          Register Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
