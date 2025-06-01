
import { useState } from 'react';
import { Calendar, MessageSquare, LogOut, Menu, Camera, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import WeeklyCalendar from './WeeklyCalendar';
import FeedbackForm from './FeedbackForm';
import EventManagement from './EventManagement';
import Certificates from './Certificates';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'certificates' | 'feedback' | 'events' | 'pastEvents'>('calendar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handlePastEventsClick = () => {
    navigate('/admin/past-events');
  };

  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/1d809d48-9a0d-444b-bd9b-8282016cd2a9.png" 
                alt="Rotaract Club MUJ Logo" 
                className="h-8 w-8 object-contain rounded-full"
              />
              {isSidebarOpen && (
                <span className="font-bold text-lg text-black">Rotaract MUJ</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
          {isSidebarOpen && (
            <p className="text-sm text-gray-600 mt-2">Welcome, {username}</p>
          )}
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button
              variant={activeTab === 'calendar' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                activeTab === 'calendar' 
                  ? 'bg-rotaract-orange text-white' 
                  : 'text-gray-600 hover:text-rotaract-orange hover:bg-stone-100'
              }`}
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isSidebarOpen && 'Calendar'}
            </Button>
            <Button
              variant={activeTab === 'certificates' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                activeTab === 'certificates' 
                  ? 'bg-rotaract-orange text-white' 
                  : 'text-gray-600 hover:text-rotaract-orange hover:bg-stone-100'
              }`}
              onClick={() => setActiveTab('certificates')}
            >
              <Award className="w-4 h-4 mr-2" />
              {isSidebarOpen && 'Certificates'}
            </Button>
            <Button
              variant={activeTab === 'events' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                activeTab === 'events' 
                  ? 'bg-rotaract-orange text-white' 
                  : 'text-gray-600 hover:text-rotaract-orange hover:bg-stone-100'
              }`}
              onClick={() => setActiveTab('events')}
            >
              <Camera className="w-4 h-4 mr-2" />
              {isSidebarOpen && 'Events'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-rotaract-orange hover:bg-stone-100"
              onClick={handlePastEventsClick}
            >
              <FileText className="w-4 h-4 mr-2" />
              {isSidebarOpen && 'Manage Past Events'}
            </Button>
            <Button
              variant={activeTab === 'feedback' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                activeTab === 'feedback' 
                  ? 'bg-rotaract-orange text-white' 
                  : 'text-gray-600 hover:text-rotaract-orange hover:bg-stone-100'
              }`}
              onClick={() => setActiveTab('feedback')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {isSidebarOpen && 'Feedback'}
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-600"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isSidebarOpen && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === 'calendar' && <WeeklyCalendar />}
        {activeTab === 'certificates' && <Certificates />}
        {activeTab === 'events' && <EventManagement />}
        {activeTab === 'feedback' && <FeedbackForm />}
      </div>
    </div>
  );
};

export default UserDashboard;
