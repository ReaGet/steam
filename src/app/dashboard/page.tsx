'use client';
import { useState, useEffect } from 'react';
import { SteamAccount, CreateAccountDTO } from '@/types/account';
import { AccountCard } from '@/components/AccountCard';
import { AccountForm } from '@/components/AccountForm';
import Modal from '@/components/Modal';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SteamAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SteamAccount | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/accounts');
      const data = await response.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (data: CreateAccountDTO) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create account');
      
      await fetchAccounts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  };

  const handleEditAccount = async (data: CreateAccountDTO) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAccount?.id,
          ...data,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update account');
      
      await fetchAccounts();
      setIsModalOpen(false);
      setEditingAccount(null);
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;

    try {
      const response = await fetch('/api/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) throw new Error('Failed to delete account');
      
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No accounts found. Add your first account to get started.
          </div>
        ) : (
          accounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={(account) => {
                setEditingAccount(account);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteAccount}
              onAuthenticate={async (id) => {/* implement authenticate */}}
            />
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
      >
        <AccountForm
          account={editingAccount}
          onSubmit={editingAccount ? handleEditAccount : handleCreateAccount}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingAccount(null);
          }}
        />
      </Modal>
    </>
  );
} 