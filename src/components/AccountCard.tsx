import { useState } from 'react';
import { SteamAccount } from '@/types/account';

interface AccountCardProps {
  account: SteamAccount;
  onEdit: (account: SteamAccount) => void;
  onDelete: (id: string) => void;
  onAuthenticate: (id: string) => Promise<void>;
}

export function AccountCard({ account, onEdit, onDelete, onAuthenticate }: AccountCardProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      await onAuthenticate(account.id);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {account.login.replace(/(?<=.{3}).(?=.*@)/g, '*')}
        </h3>
        <span className="px-2 py-1 text-sm rounded-full bg-gray-100">
          {account.region}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${
          account.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className="text-sm text-gray-600">
          {account.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(account)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(account.id)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 text-red-600"
        >
          Delete
        </button>
        <button
          onClick={handleAuthenticate}
          disabled={isAuthenticating}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 text-blue-600"
        >
          {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
        </button>
      </div>
    </div>
  );
} 