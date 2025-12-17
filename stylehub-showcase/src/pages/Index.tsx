import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Product } from '@/types';
import { productService } from '@/lib/apiServices';

const categories = [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600', href: '/shop/men' },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', href: '/shop/women' },
  { name: 'Children', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600', href: '/shop/children' },
];

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured and best sellers
        const [featured, popular] = await Promise.all([
          productService.getAll({ isFeatured: true, limit: 8 }),
          productService.getAll({ sortBy: 'popular', limit: 4 }),
        ]);

        setFeaturedProducts(featured.products);
        setBestSellers(popular.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in">
            Style Your Life
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up">
            Discover the latest trends in fashion for the whole family
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
              <Link to="/shop">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg px-8">
              <Link to="/shop?featured=true">View Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 justify-center">
              <Truck className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over ₹100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Shield className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Secure Shopping</h3>
                <p className="text-sm text-muted-foreground">100% protected payments</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <CreditCard className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Cash on Delivery</h3>
                <p className="text-sm text-muted-foreground">Pay when you receive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} to={cat.href} className="group relative h-80 rounded-2xl overflow-hidden hover-lift">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-3xl font-display font-bold text-white mb-2">{cat.name}</h3>
                  <span className="text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                    Shop Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <ProductGrid products={featuredProducts} title="Featured Products" subtitle="Handpicked favorites just for you" isLoading={isLoading} />
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link to="/shop?featured=true">View All Featured</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductGrid products={bestSellers} title="Best Sellers" subtitle="Top picks loved by our customers" isLoading={isLoading} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="gradient-primary rounded-3xl p-8 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">New Season, New Style</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Get 20% off on your first order. Use code WELCOME20 at checkout.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
