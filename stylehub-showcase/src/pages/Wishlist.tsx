import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useWishlistContext, useCartContext } from '@/contexts/AppContext';

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistContext();
  const { addItem } = useCartContext();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-display font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">Save items you love to your wishlist</p>
          <Button asChild><Link to="/shop">Start Shopping</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Wishlist ({items.length})</h1>
          <Button variant="outline" onClick={clearWishlist}>Clear All</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ product }) => (
            <div key={product.id} className="border rounded-xl overflow-hidden hover-lift">
              <Link to={`/product/${product.id}`}>
                <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover" />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`} className="font-medium hover:text-primary line-clamp-1">{product.name}</Link>
                <p className="text-primary font-bold mt-1">₹{(product.price ?? 0).toFixed(2)}</p>
                <div className="flex gap-2 mt-3">
                  <Button className="flex-1" size="sm" onClick={() => { addItem(product, 1, product.sizes[0]); removeItem(product.id); }}>
                    <ShoppingBag className="h-4 w-4 mr-1" />Add to Cart
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => removeItem(product.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
