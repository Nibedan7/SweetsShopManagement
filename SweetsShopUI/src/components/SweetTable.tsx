import { Edit, Trash2, Package } from 'lucide-react';
import { Sweet } from '@/context/SweetContext';

interface SweetTableProps {
  sweets: Sweet[];
  onEdit: (sweet: Sweet) => void;
  onDelete: (id: string) => void;
  onRestock: (sweet: Sweet) => void;
  isLoading?: boolean;
}

export function SweetTable({ sweets, onEdit, onDelete, onRestock, isLoading = false }: SweetTableProps) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="table-sweet">
          <thead>
            <tr>
              <th>Sweet</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading state
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                    Loading sweets...
                  </div>
                </td>
              </tr>
            ) : sweets.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  No sweets found. Add your first sweet!
                </td>
              </tr>
            ) : (
              // Data rows
              sweets.map((sweet, index) => (
                <tr 
                  key={sweet.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sweet.image || '🍬'}</span>
                      <span className="font-medium text-foreground">{sweet.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge-category">{sweet.category}</span>
                  </td>
                  <td className="font-semibold text-foreground">
                    ${sweet.price.toFixed(2)}
                  </td>
                  <td>
                    <span className={`font-medium ${sweet.quantity === 0 ? 'text-destructive' : 'text-foreground'}`}>
                      {sweet.quantity}
                      {sweet.quantity === 0 && (
                        <span className="ml-2 text-xs text-destructive">(Out of stock)</span>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onRestock(sweet)}
                        className="p-2 rounded-lg hover:bg-blue-100 text-muted-foreground hover:text-blue-600 transition-colors"
                        title="Restock"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(sweet)}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title='Edit'
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(sweet.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title='Delete'
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}