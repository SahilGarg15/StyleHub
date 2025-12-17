import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrdersContext } from '@/contexts/AppContext';
import { orderService } from '@/lib/apiServices';
import { cn } from '@/lib/utils';

const statusSteps = [
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const { getOrderByTrackingId, orders } = useOrdersContext();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-search on mount if tracking ID in URL
  useEffect(() => {
    if (searchParams.get('id')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingId) return;

    setIsLoading(true);
    setError('');
    
    try {
      // First try context (for logged-in users)
      let order = getOrderByTrackingId(trackingId);
      if (!order) {
        order = orders.find(o => o.id === trackingId) || null;
      }

      // If not found in context, try API (works without authentication)
      if (!order) {
        try {
          order = await orderService.getByOrderNumber(trackingId);
        } catch (apiError: any) {
          // If order number doesn't work, try as order ID
          if (apiError.response?.status === 404) {
            order = await orderService.getById(trackingId);
          }
        }
      }

      if (order) {
        setSearchedOrder(order);
        setError('');
      } else {
        setSearchedOrder(null);
        setError('No order found with this ID');
      }
    } catch (err: any) {
      console.error('Error tracking order:', err);
      setSearchedOrder(null);
      setError('Unable to track order. Please check your order number and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const index = statusSteps.findIndex(s => s.status === status);
    return index >= 0 ? index : 0;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-center mb-8">Track Your Order</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <Input 
            placeholder="Enter Order Number (e.g., ORD-XXX-XXX)" 
            value={trackingId} 
            onChange={(e) => setTrackingId(e.target.value)} 
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />Number</p><p className="font-semibold">{searchedOrder.orderNumber || searchedOrder.id}</p></div>
                <div><p className="text-sm text-muted-foreground">Status</p><p className="font-semibold capitalize">{searchedOrder.status?.toLowerCase()}</p></div>
                <div><p className="text-sm text-muted-foreground">Order Date</p><p className="font-semibold">{new Date(searchedOrder.createdAt).toLocaleDateString()}</p></div>
                <div><p className="text-sm text-muted-foreground">Total Amount</p><p className="font-semibold">${searchedOrder.total

        {error && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        )}

        {searchedOrder ? (
          <div className="space-y-8">
            <div className="bg-muted/50 rounded-xl p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-semibold">{searchedOrder.id}</p></div>
                <div><p className="text-sm text-muted-foreground">Tracking ID</p><p className="font-semibold">{searchedOrder.trackingId}</p></div>
                <div><p className="text-sm text-muted-foreground">Order Date</p><p className="font-semibold">{new Date(searchedOrder.createdAt).toLocaleDateString()}</p></div>
                <div><p className="text-sm text-muted-foreground">Est. Delivery</p><p className="font-semibold">{new Date(searchedOrder.estimatedDelivery).toLocaleDateString()}</p></div>
              </div>
            </div>

            {/* Progress */}
            <div className="flex justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-muted" />
              <div className="absolute top-5 left-0 h-1 bg-primary transition-all" style={{ width: `${(getStepIndex(searchedOrder.status) / (statusSteps.length - 1)) * 100}%` }} />
              {statusSteps.map((step, i) => {
                const isActive = i <= getStepIndex(searchedOrder.status);
                const Icon = step.icon;
                return (
                  <div key={step.status} className="relative z-10 flex flex-col items-center">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", isActive ? "gradient-primary text-white" : "bg-muted text-muted-foreground")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={cn("text-sm mt-2", isActive ? "font-medium" : "text-muted-foreground")}>{step.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {searchedOrder.items.filter(item => item?.product).map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 border rounded-lg">
                    <img src={item.product.images?.[0] || '/placeholder.png'} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div><p className="font-medium">{item.product.name}</p><p className="text-sm text-muted-foreground">Size: {item.selectedSize} × {item.quantity}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !trackingId || !error ? null : null}
      </div>
    </Layout>
  );
};

export default TrackOrder;
