
import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, LogOut, Menu, Camera, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import WeeklyCalendar from './WeeklyCalendar';
import FeedbackForm from './FeedbackForm';
import EventManagement from './EventManagement';
import Certificates from './Certificates';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'certificates' | 'past-events' | 'feedback'>('calendar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    profilePicture: null as string | null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const username = localStorage.getItem('username') || 'User';
      const savedProfile = localStorage.getItem('userProfile');
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile({
          fullName: profile.fullName || username,
          profilePicture: profile.profilePicture
        });
      } else {
        setUserProfile({
          fullName: username,
          profilePicture: null
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
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
          
          {/* User Profile Section */}
          {isSidebarOpen && (
            <div 
              className="mt-4 p-3 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={userProfile.profilePicture || ''} alt="Profile" />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userProfile.fullName}
                  </p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
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
              variant={activeTab === 'past-events' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                activeTab === 'past-events' 
                  ? 'bg-rotaract-orange text-white' 
                  : 'text-gray-600 hover:text-rotaract-orange hover:bg-stone-100'
              }`}
              onClick={() => setActiveTab('past-events')}
            >
              <Camera className="w-4 h-4 mr-2" />
              {isSidebarOpen && 'Past Events'}
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

        {/* Logout */}
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
        {activeTab === 'past-events' && <EventManagement />}
        {activeTab === 'feedback' && <FeedbackForm />}
      </div>
    </div>
  );
};

export default UserDashboard;
