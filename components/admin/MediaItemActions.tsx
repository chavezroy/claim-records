'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MediaItemActionsProps {
  mediaId: string;
  originalFilename: string;
  altText: string | null;
}

export default function MediaItemActions({
  mediaId,
  originalFilename,
  altText,
}: MediaItemActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editForm, setEditForm] = useState({
    original_filename: originalFilename,
    alt_text: altText || '',
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_filename: editForm.original_filename.trim(),
          alt_text: editForm.alt_text.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update media');
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this media item? This action cannot be undone.')) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete media');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Confirm Delete'}
        </button>
        <button
          onClick={() => {
            setIsDeleting(false);
            setError('');
          }}
          disabled={loading}
          className="text-gray-600 hover:text-gray-800 text-sm disabled:opacity-50"
        >
          Cancel
        </button>
        {error && (
          <span className="text-red-600 text-xs">{error}</span>
        )}
      </div>
    );
  }

  if (isEditing) {
    return (
      <form onSubmit={handleEdit} className="space-y-2">
        <div>
          <input
            type="text"
            value={editForm.original_filename}
            onChange={(e) => setEditForm({ ...editForm, original_filename: e.target.value })}
            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Filename"
            required
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="text"
            value={editForm.alt_text}
            onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Alt text (optional)"
            disabled={loading}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditForm({ original_filename: originalFilename, alt_text: altText || '' });
              setError('');
            }}
            disabled={loading}
            className="text-gray-600 hover:text-gray-800 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        {error && (
          <div className="text-red-600 text-xs">{error}</div>
        )}
      </form>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => setIsEditing(true)}
        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
      >
        Edit
      </button>
      <button
        onClick={() => setIsDeleting(true)}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Delete
      </button>
    </div>
  );
}

