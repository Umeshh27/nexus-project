import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 z-10">
        <div className="flex items-start gap-3">
          {danger && (
            <div className="bg-red-50 rounded-lg p-2 mt-0.5">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg text-gray-900">{title}</h3>
            <p className="text-gray-500 mt-2 text-sm">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={onCancel}>Cancel</button>
          <button
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-navy-500 hover:bg-navy-600'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
