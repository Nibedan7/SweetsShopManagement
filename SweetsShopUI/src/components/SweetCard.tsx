import { ShoppingCart } from 'lucide-react';

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

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: number) => void;
}

export function SweetCard({ sweet, onPurchase }: SweetCardProps) {
  const isOutOfStock = sweet.quantity === 0;
  // Use the sweet's image if available, otherwise use a random icon
  const sweetIcon = sweet.image || getRandomIcon(sweet.id);

  return (
    <div className="sweet-card group">
      {/* Image/Emoji Area */}
      <div className="relative h-40 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {sweetIcon}
        </span>
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 badge-category">
          {sweet.category}
        </span>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          {sweet.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            ${sweet.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            {sweet.quantity} available
          </span>
        </div>

        <button
          onClick={() => onPurchase(sweet.id)}
          disabled={isOutOfStock}
          className={`w-full btn-sweet flex items-center justify-center gap-2 ${
            isOutOfStock 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'btn-primary'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>
      </div>
    </div>
  );
}