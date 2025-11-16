'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentsSectionProps {
  entityType: 'post' | 'artist' | 'product' | 'video';
  entityId: string;
}

export default function CommentsSection({ entityType, entityId }: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [entityType, entityId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments/${entityType}/${entityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment: any) => {
    setComments([newComment, ...comments]);
  };

  if (loading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Comments ({comments.length})</h3>
      <CommentForm
        entityType={entityType}
        entityId={entityId}
        onCommentAdded={handleCommentAdded}
      />
      <CommentList comments={comments} entityType={entityType} entityId={entityId} />
    </div>
  );
}

