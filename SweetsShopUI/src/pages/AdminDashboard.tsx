import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchFilter } from '@/components/SearchFilter';
import { SweetTable } from '@/components/SweetTable';
import { SweetModal } from '@/components/SweetModal';
import { RestockModal } from '@/components/RestockModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Sweet } from '@/context/SweetContext'; // Keeping this for type definitions
import { useToastNotification } from '@/components/Toast';
import { Plus, Package, DollarSign, TrendingUp } from 'lucide-react';
import { getSweets, createSweet, updateSweet, deleteSweet, restockSweet } from '@/api/sweetService';

export default function AdminDashboard() {
  const { showToast } = useToastNotification();
  
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [restockingSweet, setRestockingSweet] = useState<Sweet | null>(null);

  // Fetch sweets from API
  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      const data = await getSweets();
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

  // Filter sweets
  const filteredSweets = useMemo(() => {
    return sweets.filter(sweet => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || sweet.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sweets, searchQuery, selectedCategory]);

  // Stats
  const stats = useMemo(() => ({
    totalProducts: sweets.length,
    totalValue: sweets.reduce((sum, s) => sum + (s.price * s.quantity), 0),
    outOfStock: sweets.filter(s => s.quantity === 0).length,
    lowStock: sweets.filter(s => s.quantity > 0 && s.quantity < 10).length,
  }), [sweets]);

  const handleAdd = () => {
    setModalMode('add');
    setEditingSweet(null);
    setModalOpen(true);
  };

  const handleEdit = (sweet: Sweet) => {
    setModalMode('edit');
    setEditingSweet(sweet);
    setModalOpen(true);
  };

  const handleRestock = (sweet: Sweet) => {
    setRestockingSweet(sweet);
    setRestockModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Sweet, 'id'>) => {
    try {
      if (modalMode === 'add') {
        await createSweet(data);
        showToast('Sweet added successfully!');
      } else if (editingSweet) {
        await updateSweet(parseInt(editingSweet.id), data);
        showToast('Sweet updated successfully!');
      }
      
      // Refresh sweets list
      await fetchSweets();
      setModalOpen(false);
    } catch (error: any) {
      console.error('Error saving sweet:', error);
      showToast(`Failed to ${modalMode} sweet`, 'error');
    }
  };

  const handleRestockSubmit = async (id: number, quantity: number) => {
    try {
      await restockSweet(id, quantity);
      showToast('Sweet restocked successfully!');
      
      // Refresh sweets list
      await fetchSweets();
      setRestockModalOpen(false);
    } catch (error: any) {
      console.error('Error restocking sweet:', error);
      showToast('Failed to restock sweet', 'error');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteSweet(deleteId);
        showToast('Sweet deleted successfully!', 'error');
        setDeleteId(null);
        
        // Refresh the sweets list
        await fetchSweets();
      } catch (error: any) {
        console.error('Error deleting sweet:', error);
        showToast('Failed to delete sweet', 'error');
      }
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Manage your sweet inventory">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="sweet-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="sweet-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inventory Value</p>
              <p className="text-2xl font-bold text-foreground">${stats.totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="sweet-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-foreground">{stats.outOfStock}</p>
            </div>
          </div>
        </div>

        <div className="sweet-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-caramel/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-caramel" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-foreground">{stats.lowStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Sweet Inventory</h2>
        <button onClick={handleAdd} className="btn-primary">
          <Plus className="w-5 h-5" />
          Add New Sweet
        </button>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Table */}
      <SweetTable
        sweets={filteredSweets}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(parseInt(id))}
        onRestock={handleRestock}
        isLoading={isLoading}
      />

      {/* Add/Edit Modal */}
      <SweetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        sweet={editingSweet}
        mode={modalMode}
        refreshSweets={fetchSweets}
      />

      {/* Restock Modal */}
      <RestockModal
        isOpen={restockModalOpen}
        onClose={() => setRestockModalOpen(false)}
        onSubmit={handleRestockSubmit}
        sweet={restockingSweet}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Sweet?"
        message="This action cannot be undone. Are you sure you want to delete this sweet?"
      />
    </DashboardLayout>
  );
}