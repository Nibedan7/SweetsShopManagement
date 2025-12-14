import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchFilter } from '@/components/SearchFilter';
import { SweetCard } from '@/components/SweetCard';
import { useToastNotification } from '@/components/Toast';
import { ShoppingBag, Package, Star } from 'lucide-react';
import { getSweets, purchaseSweet, searchSweets } from '@/api/sweetService';

// Define Sweet interface locally since we're removing context dependency
interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string; // Optional for backward compatibility
}

// Static icons to assign randomly
const SWEET_ICONS = ['🍬', '🍭', '🧁', '🍰', '🥧', '🍪', '🍩', '🎂', '🍓', '🫐', '🍋', '🍃', '❤️', '🐻', '⭐'];

// Function to get random icon
const getRandomIcon = (id: number) => {
  // Use ID as seed for consistent random icon
  const index = id % SWEET_ICONS.length;
  return SWEET_ICONS[index];
};

export default function UserDashboard() {
  const { showToast } = useToastNotification();
  
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [useSearchAPI, setUseSearchAPI] = useState(false);

  // Fetch sweets from API
  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      let data;
      
      if (useSearchAPI) {
        // Use search API with filters
        const searchParams: any = {};
        
        if (searchQuery) searchParams.name = searchQuery;
        if (selectedCategory) searchParams.category = selectedCategory;
        if (minPrice > 0) searchParams.min_price = minPrice;
        if (maxPrice < 100) searchParams.max_price = maxPrice;
        
        data = await searchSweets(searchParams);
      } else {
        // Use basic get all sweets API
        data = await getSweets();
      }
      
      setSweets(data);
    } catch (error: any) {
      console.error('Error fetching sweets:', error);
      showToast('Failed to load sweets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSweets();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    if (useSearchAPI) {
      fetchSweets();
    }
  }, [searchQuery, selectedCategory, minPrice, maxPrice]);

  // Filter sweets locally if not using search API
  const filteredSweets = useMemo(() => {
    if (useSearchAPI) {
      // API already filtered, return as is
      return sweets;
    } else {
      // Apply local filtering
      return sweets.filter(sweet => {
        const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || sweet.category === selectedCategory;
        const matchesMinPrice = sweet.price >= minPrice;
        const matchesMaxPrice = sweet.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
      });
    }
  }, [sweets, searchQuery, selectedCategory, minPrice, maxPrice, useSearchAPI]);

  // Stats
  const stats = useMemo(() => ({
    available: sweets.filter(s => s.quantity > 0).length,
    categories: [...new Set(sweets.map(s => s.category))].length,
  }), [sweets]);

  const handlePurchase = async (id: number) => {
    const sweet = sweets.find(s => s.id === id);
    if (!sweet) return;

    try {
      // Call the purchase API
      const updatedSweet = await purchaseSweet(id);
      
      // Update the sweet in the local state
      setSweets(prevSweets => 
        prevSweets.map(s => s.id === id ? updatedSweet : s)
      );
      
      showToast(`Purchased ${sweet.name}!`);
    } catch (error: any) {
      console.error('Error purchasing sweet:', error);
      
      // Handle API errors
      if (error.detail) {
        showToast(error.detail, 'error');
      } else if (error.message) {
        showToast(error.message, 'error');
      } else {
        showToast('Unable to purchase - out of stock', 'error');
      }
    }
  };

  return (
    <DashboardLayout title="Sweet Shop" subtitle="Browse and purchase delicious treats">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-sweet p-8 mb-8">
        <div className="relative z-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
            Welcome to Sweet Shop! 🍬
          </h2>
          <p className="text-primary-foreground/80 max-w-lg">
            Explore our delightful collection of handcrafted sweets, chocolates, and pastries.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-20">
          <span className="text-[150px]">🧁</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="sweet-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Sweets</p>
            <p className="text-2xl font-bold text-foreground">{stats.available}</p>
          </div>
        </div>

        <div className="sweet-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <Star className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold text-foreground">{stats.categories}</p>
          </div>
        </div>

        <div className="sweet-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-strawberry/20 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-strawberry" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold text-foreground">{sweets.length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceRangeChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
          setUseSearchAPI(true);
        }}
      />

      {/* Sweet Cards Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
          <span className="text-muted-foreground">Loading sweets...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map((sweet, index) => (
            <div 
              key={sweet.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <SweetCard sweet={sweet} onPurchase={handlePurchase} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredSweets.length === 0 && (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">No sweets found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </DashboardLayout>
  );
}