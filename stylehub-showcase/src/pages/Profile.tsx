import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthContext, useOrdersContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout, updateProfile } = useAuthContext();
  const { orders } = useOrdersContext();

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    // Only redirect if loading is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userOrders = orders;

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'confirmed': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and orders</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="addresses">
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View and track all your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userOrders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No orders yet</p>
                        <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <img
                                  key={idx}
                                  src={item.product.images[0]}
                                  alt=""
                                  className="w-16 h-16 rounded object-cover"
                                />
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-sm font-medium">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="font-bold text-lg">₹{(order.total ?? 0).toFixed(2)}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/track-order?id=${order.trackingId}`)}
                                >
                                  Track Order
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/order-confirmation/${order.id}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!editMode}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="flex gap-2">
                      {editMode ? (
                        <>
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                          <Button variant="outline" onClick={() => {
                            setEditMode(false);
                            setProfileData({
                              name: user?.name || '',
                              email: user?.email || '',
                              phone: user?.phone || '',
                            });
                          }}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setEditMode(true)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>
                      Manage your shipping addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(user.addresses?.length ?? 0) === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No saved addresses</p>
                        <Button>Add Address</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(user.addresses ?? []).map((address) => (
                          <div key={address.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-semibold">{address.name}</p>
                              {address.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{address.street}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.country}</p>
                            <p className="text-sm text-muted-foreground mt-2">{address.phone}</p>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">Delete</Button>
                            </div>
                          </div>
                        ))}
                        <Button className="w-full">Add New Address</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
