import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterOptions, Product } from '@/types';
import { productService } from '@/lib/apiServices';

const Shop = () => {
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    category,
    subcategory,
    search: searchQuery,
    sortBy: 'popular',
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {};
        
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        if (filters.priceRange) {
          params.minPrice = filters.priceRange[0];
          params.maxPrice = filters.priceRange[1];
        }
        if (filters.brands?.length) params.brands = filters.brands.join(',');
        if (filters.rating) params.minRating = filters.rating;
        
        // Map sortBy to backend format
        if (filters.sortBy === 'price-asc') params.sortBy = 'price';
        else if (filters.sortBy === 'price-desc') params.sortBy = 'price-desc';
        else if (filters.sortBy === 'rating') params.sortBy = 'rating';
        else if (filters.sortBy === 'newest') params.sortBy = 'newest';
        else params.sortBy = 'popular';

        const data = await productService.getAll(params);
        
        let result = data.products;

        // Apply client-side filters that backend doesn't support
        if (filters.subcategory) {
          result = result.filter(p => p.subcategory === filters.subcategory);
        }
        if (filters.sizes?.length) {
          result = result.filter(p => {
            const productSizes = Array.isArray(p.sizes) ? p.sizes : [];
            return productSizes.some(s => filters.sizes!.includes(s));
          });
        }

        setProducts(result);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Update filters when URL params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category,
      subcategory,
      search: searchQuery,
    }));
  }, [category, subcategory, searchQuery]);

  const title = subcategory 
    ? `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} for ${category?.charAt(0).toUpperCase()}${category?.slice(1)}`
    : category 
      ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection`
      : filters.search 
        ? `Search: "${filters.search}"`
        : 'All Products';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">
            {isLoading ? 'Loading...' : `${products.length} products`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground hidden md:block">
                {isLoading ? 'Loading...' : `Showing ${products.length} results`}
              </p>
              <p className="text-sm text-muted-foreground hidden md:block">
                {isLoading ? 'Loading...' : `Showing ${products.length} results`}
              </p>
              <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(f => ({ ...f, sortBy: value }))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
