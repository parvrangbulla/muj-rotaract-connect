
import { X, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  instagram: string;
  email?: string;
  bio?: string;
}

interface TeamMemberPopupProps {
  member: TeamMember | null;
  onClose: () => void;
}

const TeamMemberPopup = ({ member, onClose }: TeamMemberPopupProps) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 fade-in-0 duration-500">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Member Image */}
        <div className="h-64 overflow-hidden">
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Member Info */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
          <p className="text-rotaract-orange font-semibold mb-4">{member.position}</p>
          
          {member.bio && (
            <p className="text-gray-600 mb-6">
              {member.bio}
            </p>
          )}

          {/* Contact Links */}
          <div className="flex gap-3 justify-center">
            <a 
              href={member.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-all duration-300 hover:scale-110 transform"
            >
              <Instagram size={20} />
            </a>
            {member.email && (
              <a 
                href={`mailto:${member.email}`}
                className="bg-rotaract-orange text-white p-3 rounded-full hover:bg-rotaract-orange/90 transition-all duration-300 hover:scale-110 transform"
              >
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPopup;
