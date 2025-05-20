
import PageHeader from "@/components/PageHeader";
import EventCalendar from "@/components/EventCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Events = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Events"
        subtitle="Annual event calendar and flagship events" 
        backgroundImage="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=3540&auto=format&fit=crop"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Annual Event Calendar</h2>
          <div className="mt-12">
            <EventCalendar />
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Flagship Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {/* Blood Donation Camp */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop" 
                  alt="Blood Donation Camp" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Blood Donation Camp (BDC)</CardTitle>
                    <CardDescription>Annual Event</CardDescription>
                  </div>
                  <Badge className="bg-rotaract-orange">Flagship</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our annual Blood Donation Camp is one of our most impactful events where we partner
                  with local hospitals and blood banks to organize a large-scale donation drive on campus.
                </p>
                <p className="mb-4">
                  The event aims to raise awareness about the importance of blood donation and 
                  encourage students, faculty, and staff to contribute to this life-saving cause.
                </p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center">
                    <span className="font-semibold w-24">When:</span>
                    <span>July every year</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Where:</span>
                    <span>MUJ Campus</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Impact:</span>
                    <span>300+ donations annually</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Daan Utsav */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop" 
                  alt="Daan Utsav" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Daan Utsav</CardTitle>
                    <CardDescription>Festival of Giving</CardDescription>
                  </div>
                  <Badge className="bg-rotaract-orange">Flagship</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Daan Utsav (Festival of Giving) is our annual contribution to the joy of giving week 
                  celebrated across India. During this event, we organize various donation drives
                  to collect clothes, books, stationery, and other essential items.
                </p>
                <p className="mb-4">
                  These donated items are then distributed to underprivileged communities, orphanages, 
                  and schools in and around Jaipur, bringing smiles to hundreds of faces.
                </p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center">
                    <span className="font-semibold w-24">When:</span>
                    <span>October every year</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Where:</span>
                    <span>Multiple locations</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Impact:</span>
                    <span>1000+ beneficiaries annually</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Past Events</h2>
          
          <Tabs defaultValue="all" className="mt-12">
            <TabsList className="grid w-full md:w-[600px] mx-auto grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="csd">CSD</TabsTrigger>
              <TabsTrigger value="cmd">CMD</TabsTrigger>
              <TabsTrigger value="isd">ISD</TabsTrigger>
              <TabsTrigger value="pdd">PDD</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sample past events - would be replaced with actual data */}
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-green-600 mb-2">CSD</Badge>
                    <h3 className="font-semibold text-lg">Orientation Session</h3>
                    <p className="text-sm text-gray-500">August 2024</p>
                    <p className="mt-2 text-sm">Welcome session for new members and introduction to Rotaract Club.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-blue-600 mb-2">CMD</Badge>
                    <h3 className="font-semibold text-lg">Tree Plantation Drive</h3>
                    <p className="text-sm text-gray-500">September 2024</p>
                    <p className="mt-2 text-sm">Environmental initiative to plant trees around campus and nearby areas.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1559223607-a43f990c67bd?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-purple-600 mb-2">ISD</Badge>
                    <h3 className="font-semibold text-lg">International Cultural Exchange</h3>
                    <p className="text-sm text-gray-500">November 2024</p>
                    <p className="mt-2 text-sm">Virtual exchange program with Rotaract clubs from other countries.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-red-600 mb-2">PDD</Badge>
                    <h3 className="font-semibold text-lg">Resume Building Workshop</h3>
                    <p className="text-sm text-gray-500">January 2025</p>
                    <p className="mt-2 text-sm">Professional development session on building effective resumes.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1607988795691-3d0147b43231?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-blue-600 mb-2">CMD</Badge>
                    <h3 className="font-semibold text-lg">Visit to Orphanage</h3>
                    <p className="text-sm text-gray-500">February 2025</p>
                    <p className="mt-2 text-sm">Visit to local orphanage with donations and activities for children.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-green-600 mb-2">CSD</Badge>
                    <h3 className="font-semibold text-lg">Annual Meetup</h3>
                    <p className="text-sm text-gray-500">March 2025</p>
                    <p className="mt-2 text-sm">Celebration and recognition of achievements throughout the year.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="csd" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-green-600 mb-2">CSD</Badge>
                    <h3 className="font-semibold text-lg">Orientation Session</h3>
                    <p className="text-sm text-gray-500">August 2024</p>
                    <p className="mt-2 text-sm">Welcome session for new members and introduction to Rotaract Club.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-green-600 mb-2">CSD</Badge>
                    <h3 className="font-semibold text-lg">Annual Meetup</h3>
                    <p className="text-sm text-gray-500">March 2025</p>
                    <p className="mt-2 text-sm">Celebration and recognition of achievements throughout the year.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="cmd" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-blue-600 mb-2">CMD</Badge>
                    <h3 className="font-semibold text-lg">Tree Plantation Drive</h3>
                    <p className="text-sm text-gray-500">September 2024</p>
                    <p className="mt-2 text-sm">Environmental initiative to plant trees around campus and nearby areas.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1607988795691-3d0147b43231?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-blue-600 mb-2">CMD</Badge>
                    <h3 className="font-semibold text-lg">Visit to Orphanage</h3>
                    <p className="text-sm text-gray-500">February 2025</p>
                    <p className="mt-2 text-sm">Visit to local orphanage with donations and activities for children.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="isd" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1559223607-a43f990c67bd?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-purple-600 mb-2">ISD</Badge>
                    <h3 className="font-semibold text-lg">International Cultural Exchange</h3>
                    <p className="text-sm text-gray-500">November 2024</p>
                    <p className="mt-2 text-sm">Virtual exchange program with Rotaract clubs from other countries.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="pdd" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="bg-red-600 mb-2">PDD</Badge>
                    <h3 className="font-semibold text-lg">Resume Building Workshop</h3>
                    <p className="text-sm text-gray-500">January 2025</p>
                    <p className="mt-2 text-sm">Professional development session on building effective resumes.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Events;
