import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartContext, useAuthContext, useOrdersContext } from '@/contexts/AppContext';
import { Address } from '@/types';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getShipping, getTax, getTotal, clearCart } = useCartContext();
  const { user, isAuthenticated } = useAuthContext();
  const { createOrder } = useOrdersContext();

  const [address, setAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.selectedSize,
        })),
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        },
        paymentMethod: 'COD',
        customerName: address.name,
        customerPhone: address.phone,
        customerEmail: !isAuthenticated ? guestEmail : (user?.email || ''),
      };

      const order = await createOrder(orderData);
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!isAuthenticated && (
              <div className="p-6 border rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="your@email.com" />
                </div>
              </div>
            )}

            <div className="p-6 border rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" required value={address.name} onChange={(e) => setAddress(a => ({ ...a, name: e.target.value }))} /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" required value={address.phone} onChange={(e) => setAddress(a => ({ ...a, phone: e.target.value }))} /></div>
                <div className="sm:col-span-2"><Label htmlFor="street">Street Address</Label><Input id="street" required value={address.street} onChange={(e) => setAddress(a => ({ ...a, street: e.target.value }))} /></div>
                <div><Label htmlFor="city">City</Label><Input id="city" required value={address.city} onChange={(e) => setAddress(a => ({ ...a, city: e.target.value }))} /></div>
                <div><Label htmlFor="state">State</Label><Input id="state" required value={address.state} onChange={(e) => setAddress(a => ({ ...a, state: e.target.value }))} /></div>
                <div><Label htmlFor="zip">ZIP Code</Label><Input id="zip" required value={address.zipCode} onChange={(e) => setAddress(a => ({ ...a, zipCode: e.target.value }))} /></div>
                <div><Label htmlFor="country">Country</Label><Input id="country" required value={address.country} onChange={(e) => setAddress(a => ({ ...a, country: e.target.value }))} /></div>
              </div>
            </div>

            <div className="p-6 border rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
                <div className="h-4 w-4 rounded-full border-4 border-primary" />
                <div><p className="font-medium">Cash on Delivery (COD)</p><p className="text-sm text-muted-foreground">Pay when you receive your order</p></div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                  <img src={item.product.images[0]} alt="" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1"><p className="text-sm font-medium line-clamp-1">{item.product.name}</p><p className="text-xs text-muted-foreground">Size: {item.selectedSize} × {item.quantity}</p><p className="text-sm font-bold">₹{((item.product.price ?? 0) * item.quantity).toFixed(2)}</p></div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{getSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{getShipping() === 0 ? 'Free' : `₹${getShipping().toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>GST (18%)</span><span>₹{getTax().toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{getTotal().toFixed(2)}</span></div>
            </div>
            <Button type="submit" className="w-full mt-6 gradient-primary text-white" size="lg">Place Order</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
