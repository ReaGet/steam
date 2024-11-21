'use client';

import { useState } from 'react';

interface TestForm {
  profileLink: string;
  region: string;
  giftId?: string;
}

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const payload: TestForm = {
      profileLink: formData.get('profileLink') as string,
      region: formData.get('region') as string,
      giftId: formData.get('giftId') as string || undefined
    };

    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Тестирование Webhook</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-2">
            Ссылка на профиль Steam:
            <input
              type="text"
              name="profileLink"
              required
              className="w-full p-2 border rounded"
              placeholder="https://steamcommunity.com/id/username"
            />
          </label>
        </div>

        <div>
          <label className="block mb-2">
            Регион:
            <select
              name="region"
              required
              className="w-full p-2 border rounded"
            >
              <option value="US">США</option>
              <option value="EU">Европа</option>
              <option value="RU">Россия</option>
              <option value="AS">Азия</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block mb-2">
            ID Подарка (необязательно):
            <input
              type="text"
              name="giftId"
              className="w-full p-2 border rounded"
              placeholder="ID подарка"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Выполняется...' : 'Отправить запрос'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Результат:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 