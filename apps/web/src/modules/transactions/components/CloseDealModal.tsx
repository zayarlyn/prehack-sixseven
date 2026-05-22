interface CloseDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  buyerId?: string;
  onConfirm: (finalPrice: number, note: string) => void;
}

export default function CloseDealModal({ isOpen, onClose, onConfirm }: CloseDealModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Close Deal</h2>
        <input type="number" placeholder="Final Price" className="w-full border p-2 rounded mb-2" />
        <textarea placeholder="Note (optional)" className="w-full border p-2 rounded mb-4" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border rounded p-2 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(0, '')}
            className="flex-1 bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
