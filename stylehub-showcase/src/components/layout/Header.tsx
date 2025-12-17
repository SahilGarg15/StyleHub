import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCartContext, useWishlistContext, useAuthContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const categories = [
  {
    name: 'Men',
    href: '/shop/men',
    subcategories: [
      { name: 'Attire', href: '/shop/men/attire' },
      { name: 'Accessories', href: '/shop/men/accessories' },
      { name: 'Footwear', href: '/shop/men/footwear' },
    ],
  },
  {
    name: 'Women',
    href: '/shop/women',
    subcategories: [
      { name: 'Attire', href: '/shop/women/attire' },
      { name: 'Accessories', href: '/shop/women/accessories' },
      { name: 'Footwear', href: '/shop/women/footwear' },
    ],
  },
  {
    name: 'Children',
    href: '/shop/children',
    subcategories: [
      { name: 'Attire', href: '/shop/children/attire' },
      { name: 'Accessories', href: '/shop/children/accessories' },
      { name: 'Footwear', href: '/shop/children/footwear' },
    ],
  },
];

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getItemCount } = useCartContext();
  const { items: wishlistItems } = useWishlistContext();
  const { user, isAuthenticated, logout } = useAuthContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="gradient-primary text-primary-foreground py-2 text-center text-sm font-medium">
        🎉 Free Shipping on Orders Over ₹100 | Cash on Delivery Available
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-2xl font-display font-bold text-gradient" onClick={() => setMobileMenuOpen(false)}>
                  StyleHub
                </Link>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="secondary">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                <nav className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <div key={category.name} className="space-y-1">
                      <Link
                        to={category.href}
                        className="font-semibold text-lg block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                      <div className="pl-4 space-y-1">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            className="block py-1 text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="text-2xl font-display font-bold text-gradient">
            StyleHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="font-medium">
                    {category.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to={category.href} className="w-full cursor-pointer">
                      All {category.name}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {category.subcategories.map((sub) => (
                    <DropdownMenuItem key={sub.href} asChild>
                      <Link to={sub.href} className="w-full cursor-pointer">
                        {sub.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
            <Button variant="ghost" className="font-medium" asChild>
              <Link to="/track-order">Track Order</Link>
            </Button>
          </nav>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
