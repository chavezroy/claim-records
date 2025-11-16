'use client';

import { useState, useEffect } from 'react';

interface VoteButtonProps {
  entityType: 'post' | 'artist' | 'product' | 'video' | 'comment';
  entityId: string;
  voteType: 'upvote' | 'downvote';
}

export default function VoteButton({ entityType, entityId, voteType }: VoteButtonProps) {
  const [count, setCount] = useState(0);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVotes();
  }, [entityType, entityId]);

  const fetchVotes = async () => {
    try {
      const response = await fetch(`/api/votes?entity_type=${entityType}&entity_id=${entityId}`);
      if (response.ok) {
        const data = await response.json();
        setCount(data[voteType] || 0);
        setUserVote(data.userVote || null);
      }
    } catch (err) {
      console.error('Failed to fetch votes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          vote_type: voteType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      const data = await response.json();
      setCount(data[voteType] || 0);
      setUserVote(data.userVote === voteType ? voteType : null);
    } catch (err) {
      console.error('Failed to submit vote:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isActive = userVote === voteType;

  return (
    <button
      onClick={handleVote}
      disabled={submitting || loading}
      className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
        isActive
          ? voteType === 'upvote'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${submitting || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {voteType === 'upvote' ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 011.414 0L10 14.586l5.293-4.879a1 1 0 111.414 1.414l-6 5.5a1 1 0 01-1.414 0l-6-5.5a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 10.293a1 1 0 010 1.414l-6 5.5a1 1 0 01-1.414 0l-6-5.5a1 1 0 111.414-1.414L10 14.586l5.293-4.879a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>{count}</span>
    </button>
  );
}

