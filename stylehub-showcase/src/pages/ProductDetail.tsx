import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, ZoomIn } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductReviews } from '@/components/product/ProductReviews';
import { SizeGuide } from '@/components/product/SizeGuide';
import { useCartContext, useWishlistContext, useRecentlyViewedContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { productService, reviewService } from '@/lib/apiServices';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartContext();
  const { isInWishlist, toggleWishlist } = useWishlistContext();
  const { addItem: addToRecentlyViewed } = useRecentlyViewedContext();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const productData = await productService.getById(id);

        setProduct(productData);
        setReviews(productData.reviews || []);
        setSelectedSize(productData.sizes[0]);
        addToRecentlyViewed(productData);

        // Fetch related products
        if (productData.category) {
          const related = await productService.getAll({ 
            category: productData.category, 
            limit: 5 
          });
          setRelatedProducts(related.products.filter(p => p.id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!product) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center">Product not found</div></Layout>;
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsZoomOpen(true)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={cn("w-20 h-20 rounded-lg overflow-hidden border-2", selectedImage === i ? "border-primary" : "border-transparent")}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Image Zoom Dialog */}
            <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
              <DialogContent className="max-w-4xl p-0">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase">{product.brand}</p>
              <h1 className="text-3xl font-display font-bold mt-1">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={cn("h-5 w-5", s <= (product.averageRating || product.rating || 0) ? "fill-accent text-accent" : "text-muted")} />)}</div>
                <span className="text-sm font-medium">{(product.averageRating || product.rating || 0).toFixed(1)}</span>
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">₹{(product.price ?? 0).toFixed(2)}</span>
              {product.originalPrice && <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>}
              {product.originalPrice && <Badge variant="destructive">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</Badge>}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Size: {selectedSize}</p>
                <SizeGuide category={product.category} subcategory={product.subcategory} />
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <Button key={s} variant={selectedSize === s ? "default" : "outline"} onClick={() => setSelectedSize(s)} className="min-w-12">{s}</Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button className="flex-1 gradient-primary text-white" size="lg" onClick={handleAddToCart}>
                <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button variant="outline" size="lg" onClick={() => toggleWishlist(product)}>
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-primary text-primary")} />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Free shipping on orders over ₹100</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="mt-16">
          <TabsList><TabsTrigger value="reviews">Reviews</TabsTrigger><TabsTrigger value="details">Details</TabsTrigger></TabsList>
          <TabsContent value="reviews" className="mt-6">
            <ProductReviews 
              reviews={reviews} 
              averageRating={product.rating ?? 0} 
              totalReviews={product.reviewCount ?? 0} 
              productId={product.id}
            />
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <div className="prose max-w-none"><p>{product.description}</p><p>Brand: {product.brand}</p><p>Category: {product.category} / {product.subcategory}</p></div>
          </TabsContent>
        </Tabs>

        {/* Related */}
        <section className="mt-16">
          <ProductGrid products={relatedProducts} title="You May Also Like" />
        </section>
      </div>
    </Layout>
  );
};

export default ProductDetail;
