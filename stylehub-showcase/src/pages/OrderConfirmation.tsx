import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useOrdersContext } from '@/contexts/AppContext';
import { Order } from '@/types';

const OrderConfirmation = () => {
  const { id } = useParams();
  const { getOrderById, orders } = useOrdersContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      // First try to find in local orders
      const localOrder = orders.find(o => o.id === id);
      if (localOrder) {
        setOrder(localOrder);
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from API
      try {
        const fetchedOrder = await getOrderById(id);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, getOrderById, orders]);

  if (isLoading) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center">Loading...</div></Layout>;
  }

  if (!order) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center">Order not found</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-display font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">Thank you for your order. We've received your order and will begin processing it soon.</p>
        <div className="bg-muted/50 rounded-xl p-6 text-left mb-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-semibold">{order.id}</p></div>
            <div><p className="text-sm text-muted-foreground">Tracking ID</p><p className="font-semibold">{order.trackingId}</p></div>
            <div><p className="text-sm text-muted-foreground">Total</p><p className="font-semibold">₹{(order.total ?? 0).toFixed(2)}</p></div>
            <div><p className="text-sm text-muted-foreground">Estimated Delivery</p><p className="font-semibold">{new Date(order.estimatedDelivery).toLocaleDateString()}</p></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild><Link to={`/track-order?id=${order.trackingId}`}>Track Order</Link></Button>
          <Button asChild variant="outline"><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
