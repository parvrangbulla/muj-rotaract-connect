
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
              The Rotaract Club of Manipal University Jaipur is a service-oriented organization 
              that brings together students who are dedicated to making a positive impact in 
              their community and developing their leadership and professional skills.
            </p>
            <p className="text-lg mb-6">
              Founded as part of Rotary International's global network, our club follows the 
              principle of "Service Above Self" and works to address various social issues 
              through meaningful projects and initiatives.
            </p>
            <p className="text-lg mb-10">
              Our members come from diverse academic backgrounds but share a common commitment 
              to community service, leadership development, and building international understanding.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg mb-10">
              To develop a network of young adults committed to the advancement of international 
              understanding, goodwill, and peace through a framework of friendship and service.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg mb-6">
              To be recognized as the leading youth service organization at Manipal University Jaipur 
              that empowers students to create sustainable positive change in our communities.
            </p>
            <p className="text-lg mb-10">
              We strive to foster an environment where members can develop professionally, build 
              meaningful relationships, and contribute to society through service projects.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Service</h3>
                <p>We are committed to serving our community and addressing critical societal needs.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Leadership</h3>
                <p>We develop leadership skills through hands-on experience in organizing and executing projects.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Fellowship</h3>
                <p>We build lasting friendships and professional connections through our shared commitment to service.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                <p>We uphold ethical standards and transparency in all our activities.</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">Our Affiliation</h2>
            <p className="text-lg mb-6">
              The Rotaract Club of Manipal University Jaipur is sponsored by a local Rotary Club and is part 
              of Rotary International's global network of service clubs.
            </p>
            <p className="text-lg">
              This connection gives our members opportunities to collaborate with Rotarians, access mentorship, 
              and participate in district, national, and international Rotary events and conferences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
