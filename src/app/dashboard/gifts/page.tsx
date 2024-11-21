'use client';
import { useState, useEffect } from 'react';
import { Gift, CreateGiftDTO } from '@/types/gift';
import { GiftCard } from '@/components/GiftCard';
import { GiftForm } from '@/components/GiftForm';
import Modal from '@/components/Modal';

export default function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gifts');
      const data = await response.json();
      setGifts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch gifts:', error);
      setGifts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ... остальные обработчики из Dashboard компонента для подарков ...


  const handleCreateGift = async (data: CreateGiftDTO) => {
    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create gift');
      }
      
      await fetchGifts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating gift:', error);
      throw error;
    }
  };

  const handleEditGift = async (data: CreateGiftDTO) => {
    try {
      const response = await fetch('/api/gifts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingGift?.id,
          ...data,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update gift');
      }
      
      await fetchGifts();
      setIsModalOpen(false);
      setEditingGift(null);
    } catch (error) {
      console.error('Error updating gift:', error);
      throw error;
    }
  };

  const handleDeleteGift = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gift?')) {
      return;
    }

    try {
      const response = await fetch('/api/gifts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gift');
      }
      
      await fetchGifts();
    } catch (error) {
      console.error('Error deleting gift:', error);
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
        <h1 className="text-2xl font-semibold text-gray-900">Gifts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Gift
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No gifts found. Add your first gift to get started.
          </div>
        ) : (
          gifts.map(gift => (
            <GiftCard
              key={gift.id}
              gift={gift}
              onEdit={(gift) => {
                setEditingGift(gift);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteGift}
            />
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingGift(null);
        }}
      >
        <GiftForm
          gift={editingGift}
          onSubmit={editingGift ? handleEditGift : handleCreateGift}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingGift(null);
          }}
        />
      </Modal>
    </>
  );
} 