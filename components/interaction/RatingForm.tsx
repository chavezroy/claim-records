'use client';

import { useState } from 'react';

interface RatingFormProps {
  entityType: 'post' | 'artist' | 'product' | 'video';
  entityId: string;
  currentRating?: number | null;
  onRatingSubmitted: (rating: any) => void;
}

export default function RatingForm({
  entityType,
  entityId,
  currentRating,
  onRatingSubmitted,
}: RatingFormProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStarClick = async (rating: number) => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          rating_value: rating,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit rating');
      }

      const data = await response.json();
      onRatingSubmitted(data.rating);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoveredRating || currentRating || 0;

  return (
    <div>
      {error && (
        <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 mr-2">Rate this:</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
              disabled={submitting}
              className="focus:outline-none"
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  star <= displayRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 hover:text-yellow-300'
                } ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {currentRating && (
          <span className="text-sm text-gray-600 ml-2">You rated: {currentRating} stars</span>
        )}
      </div>
    </div>
  );
}

