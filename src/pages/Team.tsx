
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TeamMemberPopup from "@/components/TeamMemberPopup";
import { HoverEffect } from "@/components/ui/card-hover-effect";


// Define team member type
type TeamMember = {
  id: number;
  name: string;
  position: string;
  image: string;
  instagram: string;
  linkedin?: string;
  phone?: string;
  bio?: string;
};

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Team Members Array - Easy to update images
  const [teamMembers] = useState<TeamMember[]>([
    // ===== EXECUTIVE BOARD =====
    {
      id: 1,
      name: "Kshitij Verma",
      position: "President",
      image: "/team-photos/kshitij.jpg",
      instagram: "https://www.instagram.com/shhtjjj/",
      phone: "+91 70580 32405",
      bio: "Making big plans, and even bigger WhatsApp groups."
    },
    {
      id: 2,
      name: "Satya Agrawal",
      position: "Secretary",
      image: "/team-photos/satya.jpeg",
      instagram: "https://www.instagram.com/satya_agrawal_/",
      phone: "+91 98259 31989",
      bio: "Order in chaos? That's my signature."
    },
    {
      id: 3,
      name: "Anwesha Jain",
      position: "Joint Secretary",
      image: "/team-photos/Anwesha jain.JPG",
      instagram: "https://www.instagram.com/anweshaa_06/",
      phone: "+91 79995 43121",
      bio: "My role? Basically the club's walking reminder notification."
    },
    {
      id: 4,
      name: "Parv Rangbulla",
      position: "Treasurer",
      image: "/team-photos/parv.jpg",
      instagram: "https://www.instagram.com/parv.rangbulla/",
      phone: "7389498920",
      bio: "Every number has a story. I just make sure they tell the right one."
    },
    
    // ===== DOMAIN DIRECTORS =====
    {
      id: 5,
      name: "Dev Kanabar",
      position: "ISD Director",
      image: "/team-photos/DEV.jpg",
      instagram: "https://www.instagram.com/dev__kanabar/",
      phone: "+91 91 0 6970 255",
      bio: "Building connections and collaborations that quietly fuel the club's growth."
    },
    {
      id: 6,
      name: "Teshant Arora",
      position: "CMD Director",
      image: "/team-photos/teshnat.jpeg",
      instagram: "https://www.instagram.com/tes_hant/",
      phone: "+91 97294 31475",
      bio: "Driven by empathy and insight to serve the community with heart and purpose."
    },
    {
      id: 7,
      name: "Natasha Joan Menezes",
      position: "CSD Director",
      image: "/team-photos/Natasha Joan Menezes.JPG",
      instagram: "https://www.instagram.com/natasha_meneze.s/",
      phone: "+91 83100 60026",
      bio: "Driven by people, powered by purpose, grounded in love."
    },
    {
      id: 8,
      name: "Harshit Attri",
      position: "PDD Director & Social Media Director",
      image: "/team-photos/harshit.jpeg",
      instagram: "https://www.instagram.com/harshitattri_/",
      phone: "+91 78279 65667",
      bio: "Fuelled by coffee, curiosity, and a bit of chaos."
    },
    {
      id: 9,
      name: "Ojas Kheterpal",
      position: "PID Director",
      image: "/team-photos/OJAS KHETARPAL.jpg",
      instagram: "https://www.instagram.com/ojaskhetarpal/",
      phone: "+91 70428 83896",
      bio: "Serious about impact, unserious about everything else!"
    },
    
    // ===== SUPPORTING ROLES =====
    {
      id: 10,
      name: "Antash Patodi",
      position: "Sergeant-at-Arms",
      image: "/team-photos/Antash_.jpg",
      instagram: "https://www.instagram.com/antash_patodi/",
      phone: "+91 79995 43121",
      bio: "The quiet force behind punctuality and protocol."
    },
    {
      id: 11,
      name: "Lavanya Choudhary",
      position: "Sergeant-at-Arms",
      image: "/team-photos/lavanya.jpeg",
      instagram: "https://www.instagram.com/la_va_nya.c/",
      phone: "+91 74780 28678",
      bio: "Getting things done without drama, but somehow is the drama."
    },
    {
      id: 12,
      name: "Shreyasi Pandey",
      position: "Editor",
      image: "/team-photos/Shreyasi.png",
      instagram: "https://www.instagram.com/its.shreyasiiii/",
      phone: "+91 76480 30765",
      bio: "Turning drafts into deliverables and confusion into communication."
    },
    {
      id: 13,
      name: "Tanisha Chaturvedi",
      position: "Service Project Chair",
      image: "/team-photos/Tanisha Chaturvedi.jpg",
      instagram: "https://www.instagram.com/real_tanisha/",
      phone: "+91 90254 96635",
      bio: "Fuelled by purpose, my heart meets hustle to create meaningful magic."
    },
    {
      id: 14,
      name: "Krish Gupta",
      position: "Tech Head",
      image: "/team-photos/krish.jpeg",
      instagram: "https://www.instagram.com/7_krishgupta_7/",
      linkedin: "https://www.linkedin.com/in/krish-gupta-51637b1b8/",
      phone: "+91 98765 43210",
      bio: "Transforming ideas into digital reality, one code at a time."
    }
  ]);

  // Transform team members data for hover effect
  const hoverEffectItems = teamMembers.map(member => ({
    title: member.name,
    description: member.position,
    image: member.image,
    onClick: () => setSelectedMember(member)
  }));

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Our Team" 
        subtitle="Meet the dedicated team behind Rotaract MUJ" 
        backgroundImage="/lovable-uploads/1d89dd56-232e-4dc4-b8ea-1eaecea76977.png"
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
          
          {/* Team Cards with Hover Effect */}
          <HoverEffect 
            items={teamMembers.map(member => ({
              title: member.name,
              description: member.position,
              image: member.image,
              link: `#${member.id}`
            }))}
            className="max-w-7xl mx-auto"
            onCardClick={(index) => setSelectedMember(teamMembers[index])}
          />
          

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
