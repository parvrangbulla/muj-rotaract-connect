
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Mail, Phone } from 'lucide-react';

const NGO = () => {
  const ngos = [{
    id: 1,
    name: "Ahaan Foundation",
    description: "Ahaan describes its mission as giving a 'New Dawn' to girls at risk through holistic education, emotional well-being, and skill-building. Their work includes programs like the CREATE model for delivering 21st-century learning and emotional resilience.",
    collaboration: "Educational workshops, leadership training, emotional well-being sessions, and creative skill development programs to empower girls from marginalized communities.",
    images: ["/ngo-photos/aahan foundation.jpg", "/ngo-photos/aahaan foundation.jpg"],
    website: "https://ahanfoundation.in",
    email: "ahanfoundation.in@gmail.com",
    phone: "+91-97825-17428"
  }, {
    id: 2,
    name: "Paathshala",
    description: "Dedicated to providing quality education to children from marginalized communities through innovative teaching methods and community engagement.",
    collaboration: "Teaching support, book donation drives, and mentorship programs for students.",
    images: ["/ngo-photos/paathshala.jpg", "/ngo-photos/pathshala.jpg"],
    website: "https://www.paathshalatrust.org/",
    email: "info@paathshalatrust.org",
    phone: "97822 09683"
  }, {
    id: 3,
    name: "Hope Foundation",
    description: "Focused on community development through healthcare initiatives, environmental conservation, and women empowerment programs.",
    collaboration: "Community clean-up drives, women's skill development workshops, and healthcare awareness campaigns.",
    images: ["/ngo-photos/hopefoundation.jpg", "/ngo-photos/hope.jpg"]
  }];

  return (
    <div className="min-h-screen bg-stone-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Our NGO Partners</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We collaborate with various NGOs to create meaningful impact in our community. 
            These partnerships help us expand our reach and effectiveness in serving those in need.
          </p>
        </div>

        <div className="space-y-12">
          {ngos.map((ngo, index) => (
            <Card key={ngo.id} className="overflow-hidden shadow-lg">
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

                    {/* Contact Information */}
                    {(ngo.website || ngo.email || ngo.phone) && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-black mb-3">Contact Information:</h3>
                        <div className="space-y-2">
                          {ngo.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-rotaract-orange" />
                              <a 
                                href={ngo.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {ngo.website}
                              </a>
                            </div>
                          )}
                          {ngo.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-rotaract-orange" />
                              <a 
                                href={`mailto:${ngo.email}`}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {ngo.email}
                              </a>
                            </div>
                          )}
                          {ngo.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-rotaract-orange" />
                              <a 
                                href={`tel:${ngo.phone}`}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {ngo.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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
                    {ngo.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="aspect-square overflow-hidden rounded-lg">
                        <img src={image} alt={`${ngo.name} collaboration ${imgIndex + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </div>
  );
};

export default NGO;
