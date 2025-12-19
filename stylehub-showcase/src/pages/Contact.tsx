import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to a backend
    toast({
      title: 'Message Sent!',
      description: 'We\'ll get back to you within 24 hours.',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 22 1234 5678',
      subDetails: 'Mon-Fri 9am-6pm IST',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'support@stylehub.com',
      subDetails: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: '123 Fashion Street, Bandra West',
      subDetails: 'Mumbai 400050, India',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Friday: 9am - 6pm',
      subDetails: 'Saturday: 10am - 4pm',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <img
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920"
          alt="Contact Us"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
            We'd love to hear from you
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <Card key={info.title}>
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{info.title}</h3>
                  <p className="text-sm">{info.details}</p>
                  <p className="text-xs text-muted-foreground">{info.subDetails}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">Send us a Message</h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                />
              </div>
              <Button type="submit" className="w-full gradient-primary text-white">
                Send Message
              </Button>
            </form>
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Visit Our Store</h2>
              <p className="text-muted-foreground mb-6">
                Come visit us at our flagship store in the heart of Mumbai.
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <iframe
                title="Store Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709658!3d19.082502004761423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* FAQ Section */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">What are your shipping options?</p>
                    <p className="text-muted-foreground">
                      We offer free shipping on orders over ₹100 and express shipping for faster delivery.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">What is your return policy?</p>
                    <p className="text-muted-foreground">
                      We accept returns within 30 days of purchase for a full refund or exchange.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Do you offer cash on delivery?</p>
                    <p className="text-muted-foreground">
                      Yes! Cash on delivery is available for all orders.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
