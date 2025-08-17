
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Domains = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("csd");
  
  // Scroll to top when component mounts
  useScrollToTop();
  
  // Handle URL parameters to open specific domain tabs
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['csd', 'cmd', 'isd', 'pdd'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Our Domains" 
        subtitle="The four pillars of Rotaract MUJ" 
        backgroundImage="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=3540&auto=format&fit=crop"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">The Four Pillars of Rotaract</h2>
            <p className="text-lg">
              Rotaract Club of Manipal University Jaipur operates through four specialized domains, 
              each focusing on different aspects of service and development. These domains work 
              together to create a well-rounded experience for our members and maximize our impact.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 mb-8">
              <TabsTrigger value="csd" className="text-lg py-3">CSD</TabsTrigger>
              <TabsTrigger value="cmd" className="text-lg py-3">CMD</TabsTrigger>
              <TabsTrigger value="isd" className="text-lg py-3">ISD</TabsTrigger>
              <TabsTrigger value="pdd" className="text-lg py-3">PDD</TabsTrigger>
            </TabsList>
            
            {/* Club Service Domain (CSD) */}
            <TabsContent value="csd">
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-auto">
                    <img 
                      src="/domain-photos/CSD.jpg" 
                      alt="Club Service Domain" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <CardHeader className="px-0">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-3xl">Club Service Domain</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-0">
                      <p className="mb-6">
                        The Club Service Domain focuses on strengthening the internal operations of our club 
                        and fostering a strong sense of belonging among members. This domain ensures smooth 
                        functioning, active engagement, and a vibrant club culture.
                      </p>
                      
                      <h3 className="text-xl font-semibold mb-4">Key Responsibilities:</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Organizing club meetings and member orientation sessions</li>
                        <li>Planning team-building activities and recreational events</li>
                        <li>Maintaining club records and documentation</li>
                        <li>Fostering fellowship and unity among members</li>
                        <li>Coordinating with other domains for collaborative events</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mb-4">Notable CSD Events:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Movie Nights</h4>
                          <p className="text-sm">Fun-filled evenings to relax and bond with fellow members</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Treks</h4>
                          <p className="text-sm">Adventure trips promoting camaraderie and team spirit</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Khel Utsav</h4>
                          <p className="text-sm">Sports and games to encourage teamwork and healthy competition</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Installation Ceremony</h4>
                          <p className="text-sm">Formal induction of the new board members</p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Community Service Domain (CMD) */}
            <TabsContent value="cmd">
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-auto">
                    <img 
                      src="/domain-photos/CMD.jpg" 
                      alt="Community Service Domain" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <CardHeader className="px-0">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-3xl">Community Service Domain</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-0">
                      <p className="mb-6">
                        The Community Service Domain is dedicated to identifying and addressing the needs 
                        of our local community. Through impactful projects and initiatives, this domain 
                        strives to create meaningful social change and improve lives.
                      </p>
                      
                      <h3 className="text-xl font-semibold mb-4">Key Responsibilities:</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Planning and executing community service projects</li>
                        <li>Identifying areas of need within the local community</li>
                        <li>Organizing donation drives and charitable initiatives</li>
                        <li>Collaborating with local organizations and NGOs</li>
                        <li>Evaluating the impact of service projects</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mb-4">Notable CMD Events:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Blood Donation Camp</h4>
                          <p className="text-sm">Annual drive supporting local hospitals and blood banks</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Daan Utsav</h4>
                          <p className="text-sm">Festival of Giving to support underprivileged communities</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Plantation Drive</h4>
                          <p className="text-sm">Environmental initiative to increase green cover</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Education Drive</h4>
                          <p className="text-sm">Collecting and distributing books, stationery, and learning resources</p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* International Service Domain (ISD) */}
            <TabsContent value="isd">
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-auto">
                    <img 
                      src="/domain-photos/ISD.jpg" 
                      alt="International Service Domain" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <CardHeader className="px-0">
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-3xl">International Service Domain</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-0">
                      <p className="mb-6">
                        The International Service Domain promotes international understanding, goodwill, 
                        and peace by connecting our club with Rotaract clubs worldwide and organizing 
                        projects with global impact.
                      </p>
                      
                      <h3 className="text-xl font-semibold mb-4">Key Responsibilities:</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Facilitating international exchanges and partnerships</li>
                        <li>Organizing multicultural events and awareness campaigns</li>
                        <li>Participating in global Rotaract initiatives</li>
                        <li>Promoting cross-cultural understanding</li>
                        <li>Representing our club at international Rotaract events</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mb-4">Notable ISD Events:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">ICYE & IDYE</h4>
                          <p className="text-sm">Inter-Country and International District Youth Exchanges</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Twin Club Initiatives</h4>
                          <p className="text-sm">Collaborative projects with international partner clubs</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Global Issues Awareness</h4>
                          <p className="text-sm">Campaigns on international humanitarian issues</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Cultural Exchange Programs</h4>
                          <p className="text-sm">Promoting cross-cultural understanding and friendship</p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Professional Development Domain (PDD) */}
            <TabsContent value="pdd">
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-auto">
                    <img 
                      src="/domain-photos/PDD.jpg" 
                      alt="Professional Development Domain" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <CardHeader className="px-0">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-3xl">Professional Development Domain</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-0">
                      <p className="mb-6">
                        The Professional Development Domain focuses on enhancing the career growth and 
                        skill development of our members through interactive workshops, training sessions, 
                        and networking opportunities with industry professionals.
                      </p>
                      
                      <h3 className="text-xl font-semibold mb-4">Key Responsibilities:</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Organizing professional development workshops and seminars</li>
                        <li>Arranging industry visits and company tours</li>
                        <li>Facilitating mentorship opportunities with professionals</li>
                        <li>Conducting skill-building sessions</li>
                        <li>Creating networking opportunities with alumni and industry leaders</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mb-4">Notable PDD Events:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Yoga Awareness Workshop</h4>
                          <p className="text-sm">Promoting physical and mental well-being for balanced lifestyle</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Self-Defense Workshop</h4>
                          <p className="text-sm">Equipping members with essential safety and defense techniques</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">LinkedIn & Resume Building</h4>
                          <p className="text-sm">Training members to create impactful profiles and resumes</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1">Industry Expert Talks</h4>
                          <p className="text-sm">Sessions with professionals from various industries</p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Domains;
