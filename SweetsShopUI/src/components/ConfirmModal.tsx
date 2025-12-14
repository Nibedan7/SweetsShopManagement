import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              {cancelText}
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }} 
              className="btn-sweet flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
