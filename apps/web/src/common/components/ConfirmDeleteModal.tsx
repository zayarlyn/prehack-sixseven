interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemTitle }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Delete Item</h2>
        <p className="mb-6 text-gray-600">
          {`Are you sure you want to delete "${itemTitle}"? This action cannot be undone.`}
        </p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border rounded p-2 hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white rounded p-2 hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
