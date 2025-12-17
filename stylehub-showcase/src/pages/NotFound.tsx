import { Link } from 'react-router-dom';
import { Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 404 Text */}
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-display font-bold text-primary/10 leading-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  Page Not Found
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Oops! The page you're looking for seems to have wandered off. 
                  Let's get you back on track.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg" className="gradient-primary text-white">
              <Link to="/">
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/shop">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Shop
              </Link>
            </Button>
          </div>

          {/* Popular Links */}
          <div className="pt-12 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Or explore these popular pages:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { to: '/shop/men', label: "Men's Collection" },
                { to: '/shop/women', label: "Women's Collection" },
                { to: '/shop/children', label: "Kids' Collection" },
                { to: '/wishlist', label: 'Wishlist' },
                { to: '/track-order', label: 'Track Order' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-primary hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
