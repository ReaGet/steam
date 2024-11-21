import { useState } from 'react';
import { CreateAccountDTO, SteamAccount } from '@/types/account';

interface AccountFormProps {
  account?: SteamAccount | null;
  onSubmit: (data: CreateAccountDTO) => Promise<void>;
  onCancel: () => void;
}

export function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState<CreateAccountDTO>({
    login: account?.login || '',
    password: account?.password || '',
    region: account?.region || '',
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
      setError(err instanceof Error ? err.message : 'Failed to save account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        {account ? 'Edit Account' : 'Add New Account'}
      </h3>

      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Login
          </label>
          <input
            type="text"
            required
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {!account && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required={!account}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Region
          </label>
          <select
            required
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select region</option>
            <option value="US">United States</option>
            <option value="EU">Europe</option>
            <option value="AS">Asia</option>
          </select>
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (account ? 'Update Account' : 'Create Account')}
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