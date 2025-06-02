import { useState, useEffect } from 'react';
import { Calendar, LayoutDashboard, Users, MessageSquare, Award } from 'lucide-react';
import UserSidebar from './UserSidebar';
import EventCalendar from './EventCalendar';
import EventManagement from './EventManagement';

const UserDashboard = () => {
  const [currentUser, setCurrentUser] = useState('User');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const username = localStorage.getItem('username') || 'User';
    const userType = localStorage.getItem('userType') || 'member';
    setCurrentUser(username);
    setIsAdmin(username === 'admin' || userType === 'member');
    setIsGuest(userType === 'guest');

    const handleLogout = () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      window.location.href = '/login';
    };

    setHandleLogout(() => handleLogout);
  }, []);

  const [isGuest, setIsGuest] = useState(false);
  const [handleLogout, setHandleLogout] = useState<() => void>(() => {});

  const renderCalendarContent = () => {
    if (activeTab === 'weekly') {
      // For guests, show a simplified calendar without editing capabilities
      if (isGuest) {
        return <EventCalendar />;
      }
      return <EventCalendar />;
    }
    return <EventCalendar />;
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <UserSidebar 
        currentUser={currentUser}
        isAdmin={isAdmin}
        isGuest={isGuest}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-gray-800">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'calendar' ? 'Calendar' : 
                 activeTab === 'events' ? 'Event Management' : 
                 activeTab === 'attendance' ? 'Attendance' : 
                 activeTab === 'feedback' ? 'Feedback' : 
                 activeTab === 'certificates' ? 'Certificates' : 'Dashboard'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'dashboard' ? 'Welcome to your dashboard' : 
                 activeTab === 'calendar' ? 'View upcoming events and meetings' : 
                 activeTab === 'events' ? 'Manage club events' : 
                 activeTab === 'attendance' ? 'Track member attendance' : 
                 activeTab === 'feedback' ? 'View member feedback' : 
                 activeTab === 'certificates' ? 'Issue certificates' : ''}
              </p>
            </div>
          </header>
          
          <div className="mt-8">
            {activeTab === 'dashboard' && !isGuest && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Quick Actions</h2>
                <p>This is the dashboard content. Add quick actions and summaries here.</p>
              </div>
            )}
            
            {activeTab === 'calendar' && renderCalendarContent()}
            
            {activeTab === 'events' && !isGuest && (
              <EventManagement />
            )}
            
            {/* Guest users only see calendar */}
            {isGuest && activeTab !== 'calendar' && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Guest Access</h3>
                <p className="text-gray-500">As a guest, you can only view the calendar.</p>
              </div>
            )}
            
            {activeTab === 'attendance' && !isGuest && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Attendance</h2>
                <p>Manage and track attendance for club events.</p>
              </div>
            )}
            
            {activeTab === 'feedback' && !isGuest && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Feedback</h2>
                <p>Collect and review feedback from club members.</p>
              </div>
            )}
            
            {activeTab === 'certificates' && !isGuest && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Certificates</h2>
                <p>Issue certificates to recognize member contributions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
