import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FilterOptions } from '@/types';
import { brands } from '@/data/products';

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  showCategoryFilter?: boolean;
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '5', '6', '7', '8', '9', '10', '11', '12'];
const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Red', hex: '#DC143C' },
  { name: 'Blue', hex: '#4169E1' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Grey', hex: '#808080' },
];

export const ProductFilters = ({ filters, onFiltersChange, showCategoryFilter = true }: ProductFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange || [0, 500]);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'sizes' | 'brands', value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated.length > 0 ? updated : undefined);
  };

  const clearFilters = () => {
    onFiltersChange({
      category: filters.category,
      subcategory: filters.subcategory,
      search: filters.search,
    });
    setPriceRange([0, 500]);
  };

  const hasActiveFilters = 
    filters.priceRange || 
    (filters.sizes && filters.sizes.length > 0) || 
    (filters.brands && filters.brands.length > 0) ||
    filters.rating;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-semibold">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={(value) => updateFilter('priceRange', value as [number, number])}
          min={0}
          max={500}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div className="space-y-4">
        <h4 className="font-semibold">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.slice(0, 12).map((size) => (
            <Button
              key={size}
              variant={filters.sizes?.includes(size) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleArrayFilter('sizes', size)}
              className="h-8 px-3"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div className="space-y-4">
        <h4 className="font-semibold">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.slice(0, 10).map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands?.includes(brand)}
                onCheckedChange={() => toggleArrayFilter('brands', brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-4">
        <h4 className="font-semibold">Minimum Rating</h4>
        <Select
          value={filters.rating?.toString() || 'all'}
          onValueChange={(value) => updateFilter('rating', value !== 'all' ? Number(value) : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any rating</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button variant="outline" onClick={clearFilters} className="w-full">
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>
        <FilterContent />
      </div>
    </>
  );
};
