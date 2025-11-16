'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLoremFlickrUrl, isValidImageUrl } from '@/lib/utils/loremflickr';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featured_image?: string | null;
    author_name?: string | null;
    published_at?: Date | string | null;
    created_at: Date | string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const date = post.published_at
    ? new Date(post.published_at)
    : new Date(post.created_at);

  const imageSrc = (() => {
    if (!post.featured_image || imageError || !isValidImageUrl(post.featured_image)) {
      return getLoremFlickrUrl(400, 300, 'music,news,article', parseInt(post.id.replace(/\D/g, '').slice(0, 8) || '0', 10));
    }
    return post.featured_image;
  })();

  return (
    <Link
      href={`/news/${post.slug}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-6" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
        <h3 className="text-xl font-semibold mb-2" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '2.8em' }}>{post.title}</h3>
        {post.excerpt && (
          <p className="text-gray-600 mb-4" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.4', maxHeight: '4.2em' }}>{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.author_name || 'Claim Records'}</span>
          <time>{date.toLocaleDateString()}</time>
        </div>
      </div>
    </Link>
  );
}

