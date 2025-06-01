
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TeamMemberPopup from "@/components/TeamMemberPopup";

// Define team member type
type TeamMember = {
  id: number;
  name: string;
  position: string;
  image: string;
  instagram: string;
  email?: string;
  bio?: string;
};

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Kshitij Verma",
      position: "President",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/shhtjjj/",
      email: "president@rotaractmuj.com",
      bio: "Leading the club with vision and dedication to service above self."
    },
    {
      id: 2,
      name: "Satya Agarwal",
      position: "Secretary",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/satya_agrawal_/",
      email: "secretary@rotaractmuj.com",
      bio: "Ensuring smooth operations and maintaining club records."
    },
    {
      id: 3,
      name: "Anwesha Jain",
      position: "Joint Secretary",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/anweshaa_06/"
    },
    {
      id: 4,
      name: "Parv Rangbulla",
      position: "Treasurer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3456&auto=format&fit=crop",
      instagram: "https://www.instagram.com/parv.rangbulla/"
    },
    {
      id: 5,
      name: "Natasha Joan Menezes",
      position: "CSD Director",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/natasha_meneze.s/"
    },
    {
      id: 6,
      name: "Teshant Arora",
      position: "CMD Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3270&auto=format&fit=crop",
      instagram: "https://www.instagram.com/tes_hant/"
    },
    {
      id: 7,
      name: "Dev Kanabar",
      position: "ISD Director",
      image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=3366&auto=format&fit=crop",
      instagram: "https://www.instagram.com/dev__kanabar/"
    },
    {
      id: 8,
      name: "Harshit Attri",
      position: "PDD Director",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3376&auto=format&fit=crop",
      instagram: "https://www.instagram.com/harshitattri_/"
    },
    {
      id: 9,
      name: "Ojas Kheterpal",
      position: "PID Director",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/ojaskhetarpal/"
    },
    {
      id: 10,
      name: "Antash Patodi",
      position: "Sergeant-at-Arms",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop",
      instagram: "https://www.instagram.com/antash_patodi/"
    },
    {
      id: 11,
      name: "Lavanya Choudhary",
      position: "Sergeant-at-Arms",
      image: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/la_va_nya.c/"
    },
    {
      id: 12,
      name: "Harshit Attri",
      position: "Social Media Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/harshitattri_/"
    },
    {
      id: 13,
      name: "Shreyasi Pandey",
      position: "Editor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/its.shreyasiiii/"
    },
    {
      id: 14,
      name: "Tanisha Chaturvedi",
      position: "Service Project Chair",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3387&auto=format&fit=crop",
      instagram: "https://www.instagram.com/tanisha1607/"
    },
  ]);

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Our Team" 
        subtitle="Meet the dedicated team behind Rotaract MUJ" 
        backgroundImage="/lovable-uploads/d0be44e1-cf28-4ec5-b799-16ceec5a62ec.png"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Board Members 2024-25</h2>
            <p className="text-lg">
              Our team of dedicated Rotaractors works tirelessly to organize impactful events and
              initiatives. Meet the leaders who drive our club's vision and mission forward.
            </p>
          </div>
          
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <Card 
                  key={member.id} 
                  className="team-card overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer transform"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6 relative">
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-gray-600 cursor-help">{member.position}</p>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white p-2">
                        <p>Click to view more details</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <div className="social-links absolute top-6 right-6">
                      <a 
                        href={member.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-all duration-300 hover:scale-110"
                      >
                        <Instagram size={18} />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </section>

      {/* Team Member Popup */}
      <TeamMemberPopup 
        member={selectedMember} 
        onClose={() => setSelectedMember(null)} 
      />
    </div>
  );
};

export default Team;
