'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  replies?: Comment[];
}

interface CommentListProps {
  comments: Comment[];
  entityType: 'post' | 'artist' | 'product' | 'video';
  entityId: string;
}

export default function CommentList({ comments, entityType, entityId }: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className={`mb-4 ${depth > 0 ? 'ml-8 border-l-2 pl-4' : ''}`}>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <strong className="text-gray-900">{comment.author_name}</strong>
              <span className="text-sm text-gray-500 ml-2">
                {formatDate(comment.created_at)}
              </span>
            </div>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          {depth < 2 && (
            <button
              onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              {isReplying ? 'Cancel' : 'Reply'}
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              entityType={entityType}
              entityId={entityId}
              parentId={comment.id}
              onCommentAdded={() => {
                setReplyingTo(null);
                // Refresh comments
                window.location.reload();
              }}
              onCancel={() => setReplyingTo(null)}
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (comments.length === 0) {
    return <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>;
  }

  return <div>{comments.map((comment) => renderComment(comment))}</div>;
}

