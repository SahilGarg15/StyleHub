import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, ShoppingCart, AlertTriangle, Search, Edit, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrdersContext } from '@/contexts/AppContext';
import { products } from '@/data/products';

const AdminDashboard = () => {
  const { orders, updateOrderStatus } = useOrdersContext();
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  const stats = useMemo(() => ({
    totalProducts: products.length,
    totalOrders: orders.length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
    lowStock: products.filter(p => p.stockQuantity < 20).length,
  }), [orders]);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
  const filteredOrders = orders.filter(o => orderFilter === 'all' || o.status === orderFilter);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-primary' },
            { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-secondary' },
            { label: 'Revenue', value: `₹${(stats.revenue ?? 0).toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
            { label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'bg-destructive' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 border rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}><stat.icon className="h-6 w-6" /></div>
                <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="inventory">
          <TabsList><TabsTrigger value="inventory">Inventory</TabsTrigger><TabsTrigger value="orders">Orders</TabsTrigger></TabsList>

          <TabsContent value="inventory" className="mt-6">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
              </div>
            </div>
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredProducts.slice(0, 10).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell><div className="flex items-center gap-3"><img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover" /><span className="font-medium">{product.name}</span></div></TableCell>
                      <TableCell className="capitalize">{product.category} / {product.subcategory}</TableCell>
                      <TableCell>₹{(product.price ?? 0).toFixed(2)}</TableCell>
                      <TableCell>{product.stockQuantity}</TableCell>
                      <TableCell><Badge variant={product.stockQuantity < 20 ? "destructive" : "secondary"}>{product.stockQuantity < 20 ? 'Low Stock' : 'In Stock'}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="flex gap-4 mb-4">
              <Select value={orderFilter} onValueChange={setOrderFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Date</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No orders yet</TableCell></TableRow>
                  ) : filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>₹{(order.total ?? 0).toFixed(2)}</TableCell>
                      <TableCell><Badge variant="secondary" className="capitalize">{order.status}</Badge></TableCell>
                      <TableCell>
                        <Select value={order.status} onValueChange={(v: any) => updateOrderStatus(order.id, v)}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
