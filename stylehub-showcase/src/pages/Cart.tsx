import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartContext } from '@/contexts/AppContext';

const Cart = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getShipping, getTax, getTotal, clearCart } = useCartContext();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-display font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
          <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4 p-4 border rounded-xl">
                <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <Link to={`/product/${item.product.id}`} className="font-medium hover:text-primary">{item.product.name}</Link>
                  <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                  <p className="font-bold text-primary mt-1">₹{(item.product.price ?? 0).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.product.id, item.selectedSize)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{getSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{getShipping() === 0 ? 'Free' : `₹${getShipping().toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>GST (18%)</span><span>₹{getTax().toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{getTotal().toFixed(2)}</span></div>
            </div>
            <Button asChild className="w-full mt-6 gradient-primary text-white"><Link to="/checkout">Proceed to Checkout</Link></Button>
            <Button asChild variant="outline" className="w-full mt-2"><Link to="/shop">Continue Shopping</Link></Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
