import { Layout } from '@/components/layout/Layout';
import { Heart, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'We source the finest materials and work with trusted manufacturers to ensure every product meets our high standards.',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We listen to feedback and continuously improve to serve you better.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from product selection to customer service.',
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'We\'re committed to sustainable practices and reducing our environmental footprint.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
          alt="About StyleHub"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            About StyleHub
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
            Your trusted destination for fashion-forward clothing and accessories
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">
            Our Story
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              Founded in 2020, StyleHub began with a simple mission: to make fashion accessible 
              to everyone. We believe that style shouldn't come at a premium price, and everyone 
              deserves to look and feel their best.
            </p>
            <p>
              What started as a small online store has grown into a trusted destination for 
              fashion enthusiasts across the country. Today, we serve thousands of happy customers 
              with a carefully curated selection of clothing and accessories for men, women, and children.
            </p>
            <p>
              We're not just about selling clothes – we're about building a community of style-conscious 
              individuals who appreciate quality, value, and exceptional service. Every item in our 
              collection is handpicked by our team of fashion experts to ensure it meets our high 
              standards of quality and style.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '1000+', label: 'Products' },
            { value: '4.8/5', label: 'Average Rating' },
            { value: '24/7', label: 'Customer Support' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Founder & CEO',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
              },
              {
                name: 'Michael Chen',
                role: 'Head of Design',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
              },
              {
                name: 'Emily Rodriguez',
                role: 'Customer Experience',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
              },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="mb-4 overflow-hidden rounded-2xl aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Join the StyleHub Family
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the perfect blend of style, quality, and affordability. 
          Start your fashion journey with us today!
        </p>
        <a
          href="/shop"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 py-2 gradient-primary text-white"
        >
          Shop Now
        </a>
      </section>
    </Layout>
  );
};

export default About;
