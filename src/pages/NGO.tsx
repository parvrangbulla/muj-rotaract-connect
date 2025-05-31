import { Card, CardContent } from '@/components/ui/card';
const NGO = () => {
  const ngos = [{
    id: 1,
    name: "Aahan Foundation",
    description: "Working towards providing education and healthcare to underprivileged children. We collaborate with them on various educational initiatives and health camps.",
    collaboration: "Educational workshops, health awareness programs, and skill development sessions for children.",
    images: ["https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=3000&auto=format&fit=crop", "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=3000&auto=format&fit=crop"]
  }, {
    id: 2,
    name: "Paathshala",
    description: "Dedicated to providing quality education to children from marginalized communities through innovative teaching methods and community engagement.",
    collaboration: "Teaching support, book donation drives, and mentorship programs for students.",
    images: ["https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=3000&auto=format&fit=crop", "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=3000&auto=format&fit=crop"]
  }, {
    id: 3,
    name: "Hope Foundation",
    description: "Focused on community development through healthcare initiatives, environmental conservation, and women empowerment programs.",
    collaboration: "Community clean-up drives, women's skill development workshops, and healthcare awareness campaigns.",
    images: ["https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=3000&auto=format&fit=crop", "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=3000&auto=format&fit=crop"]
  }];
  return <div className="min-h-screen bg-stone-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Our NGO Partners</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We collaborate with various NGOs to create meaningful impact in our community. 
            These partnerships help us expand our reach and effectiveness in serving those in need.
          </p>
        </div>

        <div className="space-y-12">
          {ngos.map((ngo, index) => <Card key={ngo.id} className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Content */}
                  <div className={`p-8 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <h2 className="text-2xl font-bold text-black mb-4">{ngo.name}</h2>
                    <p className="text-gray-700 mb-4">{ngo.description}</p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-black mb-2">Our Collaboration:</h3>
                      <p className="text-gray-600">{ngo.collaboration}</p>
                    </div>

                    <div className="bg-rotaract-orange/10 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Partnership Impact:</strong> Through our collaboration with {ngo.name}, 
                        we've been able to reach more beneficiaries and create lasting positive change 
                        in our community.
                      </p>
                    </div>
                  </div>

                  {/* Images */}
                  <div className={`grid grid-cols-2 gap-2 p-2 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    {ngo.images.map((image, imgIndex) => <div key={imgIndex} className="aspect-square overflow-hidden rounded-lg">
                        <img src={image} alt={`${ngo.name} collaboration ${imgIndex + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>)}
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-black mb-4">Want to Partner With Us?</h2>
            <p className="text-gray-600 mb-6">
              If you're an NGO looking to collaborate with Rotaract Club MUJ for community service 
              and social impact initiatives, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:rotaract.muj@gmail.com" className="bg-rotaract-orange hover:bg-rotaract-orange/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Contact Us
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default NGO;