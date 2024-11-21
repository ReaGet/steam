'use client';
import { useState, useEffect } from 'react';
import { TaskLog } from '@/types/webhook';
import { LogsTable } from '@/components/LogsTable';

export default function LogsPage() {
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logs');
      const data = await response.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs([]);
    } finally {
      setIsLoading(false);
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Logs</h1>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No logs found. Activity logs will appear here.
        </div>
      ) : (
        <LogsTable logs={logs} />
      )}
    </>
  );
} 