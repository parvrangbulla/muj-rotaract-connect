import {
  Calendar,
  LayoutDashboard,
  Users,
  MessageSquare,
  Award,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom';

interface UserSidebarProps {
  currentUser: string;
  isAdmin: boolean;
  isGuest: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const UserSidebar = ({ currentUser, isAdmin, isGuest, activeTab, setActiveTab, onLogout }: UserSidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    // Only show calendar for guests
    ...(isGuest ? [
      { id: 'calendar', label: 'Calendar', icon: Calendar },
    ] : [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'events', label: 'Event Management', icon: Calendar },
      { id: 'attendance', label: 'Attendance', icon: Users },
      { id: 'feedback', label: 'Feedback', icon: MessageSquare },
      { id: 'certificates', label: 'Certificates', icon: Award },
    ])
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <Avatar className="w-12 h-12">
          <AvatarImage src="https://github.com/shadcn.png" alt={currentUser} />
          <AvatarFallback>{currentUser.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="ml-3 text-lg font-semibold">{currentUser}</span>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-rotaract-orange text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserSidebar;
