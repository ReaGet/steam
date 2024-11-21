import { Gift } from '@/types/gift';

interface GiftCardProps {
  gift: Gift;
  onEdit: (gift: Gift) => void;
  onDelete: (id: string) => void;
}

export function GiftCard({ gift, onEdit, onDelete }: GiftCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium">{gift.title}</h3>
        <span className="text-lg font-semibold text-green-600">
          ${gift.price.toFixed(2)}
        </span>
      </div>

      <div className="mb-4">
        <a 
          href={gift.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:text-blue-600 truncate block"
        >
          {gift.link}
        </a>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEdit(gift)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(gift.id)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
} 