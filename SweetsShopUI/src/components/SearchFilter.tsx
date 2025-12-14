import { Search, Filter, DollarSign } from 'lucide-react';
import { CATEGORIES } from '@/context/SweetContext';
import { useState, useEffect } from 'react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceRangeChange?: (min: number, max: number) => void;
}

export function SearchFilter({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  minPrice = 0,
  maxPrice = 100,
  onPriceRangeChange
}: SearchFilterProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice.toString());
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice.toString());
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalMinPrice(minPrice.toString());
    setLocalMaxPrice(maxPrice.toString());
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMinPrice(value);
    const numValue = parseFloat(value) || 0;
    if (onPriceRangeChange) {
      onPriceRangeChange(numValue, parseFloat(localMaxPrice) || 0);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMaxPrice(value);
    const numValue = parseFloat(value) || 0;
    if (onPriceRangeChange) {
      onPriceRangeChange(parseFloat(localMinPrice) || 0, numValue);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* First Row: Search and Category */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-sweet pl-12"
          />
        </div>

        {/* Category Filter - Changed from dropdown to text field */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by category..."
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input-sweet pl-12 min-w-[180px]"
          />
        </div>

        {/* Price Range Toggle */}
        <button
          type="button"
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            showPriceFilter 
              ? 'bg-primary text-primary-foreground' 
              : 'btn-secondary'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-medium">Price</span>
        </button>
      </div>

      {/* Second Row: Price Range (shown when toggle is active) */}
      {showPriceFilter && (
        <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-soft">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">From:</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={localMinPrice}
                onChange={handleMinPriceChange}
                className="input-sweet pl-9 w-24"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="w-8 h-0.5 bg-border"></div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">To:</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={localMaxPrice}
                onChange={handleMaxPriceChange}
                className="input-sweet pl-9 w-24"
                placeholder="100.00"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowPriceFilter(false)}
            className="ml-auto p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}