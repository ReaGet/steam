import { useState } from 'react';
import { CreateGiftDTO, Gift } from '@/types/gift';

interface GiftFormProps {
  gift?: Gift | null;
  onSubmit: (data: CreateGiftDTO) => Promise<void>;
  onCancel: () => void;
}

export function GiftForm({ gift, onSubmit, onCancel }: GiftFormProps) {
  const [formData, setFormData] = useState<CreateGiftDTO>({
    title: gift?.title || '',
    link: gift?.link || '',
    price: gift?.price || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gift');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        {gift ? 'Edit Gift' : 'Add New Gift'}
      </h3>
      
      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter game title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Steam Store Link
          </label>
          <input
            type="url"
            required
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://store.steampowered.com/app/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (USD)
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (gift ? 'Update Gift' : 'Create Gift')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="mt-3 sm:mt-0 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 