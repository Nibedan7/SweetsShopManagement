import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Sweet, CATEGORIES } from "@/context/SweetContext";
import { createSweet, updateSweet } from "@/api/sweetService"; // Adjust the import path as needed

interface SweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Sweet, "id">) => void;
  sweet?: Sweet | null;
  mode: "add" | "edit";
  refreshSweets: () => void; // New prop to refresh the sweets list after API call
}

export function SweetModal({
  isOpen,
  onClose,
  onSubmit,
  sweet,
  mode,
  refreshSweets,
}: SweetModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    price: "",
    quantity: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sweet && mode === "edit") {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price.toString(),
        quantity: sweet.quantity.toString(),
      });
    } else {
      setFormData({
        name: "",
        category: CATEGORIES[0],
        price: "",
        quantity: "",
      });
    }
    setErrors({});
  }, [sweet, mode, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Quantity must be 0 or more";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      if (mode === "add") {
        await createSweet({
          name: formData.name.trim(),
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });
      } else {
        await updateSweet(parseInt(sweet!.id), {
          name: formData.name.trim(),
          category: formData.category,
          price: parseFloat(formData.price),
        });
      }

      // Refresh the sweets list
      refreshSweets();

      // Close the modal
      onClose();
    } catch (error: any) {
      console.error("Error saving sweet:", error);

      // Handle API errors
      if (error.detail) {
        setErrors({ api: error.detail });
      } else if (error.message) {
        setErrors({ api: error.message });
      } else {
        setErrors({ api: `Failed to ${mode} sweet. Please try again.` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl font-semibold text-foreground">
            {mode === "add" ? "Add New Sweet" : "Edit Sweet"}
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
          {/* API Error */}
          {errors.api && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm">
              {errors.api}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-sweet"
              placeholder="Enter sweet name"
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category - Changed from dropdown to text field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="input-sweet"
              placeholder="Enter category"
            />
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="input-sweet"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-destructive text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className={`input-sweet ${
                  mode !== "add" ? "opacity-60 cursor-not-allowed bg-gray-300" : ""
                }`}
                placeholder="0"
                disabled={mode !== "add"}
              />
              {errors.quantity && (
                <p className="text-destructive text-sm mt-1">
                  {errors.quantity}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {mode === "add" ? "Adding..." : "Updating..."}
                </>
              ) : mode === "add" ? (
                "Add Sweet"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}