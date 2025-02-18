import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
    bio: 'Sarah founded Ticket Africa with a vision to revolutionize event ticketing across the continent.'
  },
  {
    name: 'David Okonkwo',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60',
    bio: 'David leads our technology team, ensuring seamless and secure ticketing experiences.'
  },
  {
    name: 'Amara Kente',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&auto=format&fit=crop&q=60',
    bio: 'Amara oversees day-to-day operations and partnerships across Africa.'
  }
];

const stats = [
  { label: 'Events Hosted', value: '10,000+' },
  { label: 'Happy Customers', value: '1M+' },
  { label: 'Countries', value: '15+' },
  { label: 'Partner Venues', value: '500+' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-base-200 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">About Ticket Africa</h1>
            <p className="text-xl max-w-3xl mx-auto text-base-content/80">
              We're on a mission to make event discovery and ticketing seamless across Africa,
              connecting people with unforgettable experiences.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg mb-6 text-base-content/80">
                  At Ticket Africa, we believe in the power of live experiences to bring people together
                  and create lasting memories. Our platform makes it easy for event organizers to reach
                  their audience and for attendees to discover and attend the events they love.
                </p>
                <p className="text-lg text-base-content/80">
                  We're committed to supporting the growth of Africa's entertainment and events industry
                  by providing innovative ticketing solutions and exceptional customer service.
                </p>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&auto=format&fit=crop&q=60"
                  alt="Event crowd"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-base-200 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-base-content/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <figure className="px-10 pt-10">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </figure>
                  <div className="card-body items-center text-center">
                    <h3 className="card-title">{member.name}</h3>
                    <div className="text-primary font-medium mb-2">{member.role}</div>
                    <p className="text-base-content/70">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
