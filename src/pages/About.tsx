
import PageHeader from "@/components/PageHeader";

const About = () => {
  return (
    <div className="min-h-screen">
      <PageHeader 
        title="About Rotaract MUJ" 
        subtitle="Service Above Self" 
        backgroundImage="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=3474&auto=format&fit=crop"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg mb-6">
              The Rotaract Club of Manipal University Jaipur (MUJ) is a vibrant, service-oriented organization 
              that unites students passionate about creating a positive impact in their community while developing 
              their leadership and professional skills.
            </p>
            <p className="text-lg mb-6">
              Founded as part of Rotary International's global network, our club lives by the principle of 
              "Service Above Self" and actively works to address social issues through meaningful projects 
              and impactful initiatives.
            </p>
            <p className="text-lg mb-10">
              Our members come from diverse academic backgrounds but share a common commitment to community 
              service, leadership development, and fostering international understanding.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg mb-10">
              To inspire and empower young leaders to create meaningful change through service, collaboration, 
              and innovation. We aim to build a community of driven individuals who are committed to addressing 
              social challenges, fostering cross-cultural understanding, and making a lasting impact locally and globally.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg mb-6">
              To be recognized as the leading youth service organization at Manipal University Jaipur, 
              empowering students to create sustainable positive change in our communities.
            </p>
            <p className="text-lg mb-10">
              We strive to build an environment where members can grow professionally, form meaningful 
              relationships, and contribute to society through service-driven initiatives.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Service</h3>
                <p>Committed to addressing societal needs and serving our community with purpose.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Leadership</h3>
                <p>Cultivating leadership skills through hands-on project planning and execution.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Fellowship</h3>
                <p>Building lifelong friendships and professional connections through shared service.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                <p>Upholding ethical standards, transparency, and accountability in all we do.</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">Our Affiliation</h2>
            <p className="text-lg mb-6">
              The Rotaract Club of MUJ is proudly sponsored by a local Rotary Club and is part of 
              Rotary International's global network of service clubs.
            </p>
            <p className="text-lg">
              This affiliation provides our members with opportunities to collaborate with experienced 
              Rotarians, access mentorship and professional guidance, and participate in district, 
              national, and international Rotary events and conferences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
