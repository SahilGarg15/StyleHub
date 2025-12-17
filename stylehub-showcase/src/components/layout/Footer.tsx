import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Successfully Subscribed!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold">StyleHub</h3>
            <p className="text-background/70 text-sm">
              Your one-stop destination for trendy fashion and accessories. 
              Quality meets style at affordable prices.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/shop" className="text-background/70 hover:text-background transition-colors">
                Shop All
              </Link>
              <Link to="/shop/men" className="text-background/70 hover:text-background transition-colors">
                Men's Collection
              </Link>
              <Link to="/shop/women" className="text-background/70 hover:text-background transition-colors">
                Women's Collection
              </Link>
              <Link to="/shop/children" className="text-background/70 hover:text-background transition-colors">
                Kids' Collection
              </Link>
              <Link to="/track-order" className="text-background/70 hover:text-background transition-colors">
                Track Your Order
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Customer Service</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/contact" className="text-background/70 hover:text-background transition-colors">
                Contact Us
              </Link>
              <Link to="/faq" className="text-background/70 hover:text-background transition-colors">
                FAQs
              </Link>
              <Link to="/shipping" className="text-background/70 hover:text-background transition-colors">
                Shipping Info
              </Link>
              <Link to="/returns" className="text-background/70 hover:text-background transition-colors">
                Returns & Exchanges
              </Link>
              <Link to="/size-guide" className="text-background/70 hover:text-background transition-colors">
                Size Guide
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Newsletter</h4>
            <p className="text-background/70 text-sm">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button type="submit" className="gradient-primary">
                Subscribe
              </Button>
            </form>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-background/70">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-background/70">
                <Mail className="h-4 w-4" />
                <span>support@stylehub.com</span>
              </div>
              <div className="flex items-center gap-2 text-background/70">
                <MapPin className="h-4 w-4" />
                <span>123 Fashion Street, NY</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
          <p>&copy; {new Date().getFullYear()} StyleHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-background transition-colors">
              About Us
            </Link>
            <Link to="/privacy" className="hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-background transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
