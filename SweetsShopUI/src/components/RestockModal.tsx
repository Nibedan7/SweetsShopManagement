import { useState } from 'react';
import { X, Package } from 'lucide-react';
import { Sweet } from '@/context/SweetContext';

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, quantity: number) => void;
  sweet?: Sweet | null;
}

export function RestockModal({ isOpen, onClose, onSubmit, sweet }: RestockModalProps) {
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !sweet) return;

    setIsLoading(true);
    
    try {
      await onSubmit(parseInt(sweet.id), parseInt(quantity));
      setQuantity('');
      setErrors({});
      onClose();
    } catch (error: any) {
      console.error('Error restocking sweet:', error);
      
      // Handle API errors
      if (error.detail) {
        setErrors({ api: error.detail });
      } else if (error.message) {
        setErrors({ api: error.message });
      } else {
        setErrors({ api: 'Failed to restock sweet. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !sweet) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Restock Sweet
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Sweet Info */}
          <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">{sweet.image || '🍬'}</span>
            <div>
              <p className="font-medium text-foreground">{sweet.name}</p>
              <p className="text-sm text-muted-foreground">Current stock: {sweet.quantity}</p>
            </div>
          </div>

          {/* API Error */}
          {errors.api && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm">
              {errors.api}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Quantity to Add</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-sweet"
              placeholder="Enter quantity to add"
            />
            {errors.quantity && <p className="text-destructive text-sm mt-1">{errors.quantity}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Restocking...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Restock
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}