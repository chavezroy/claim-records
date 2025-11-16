import Link from 'next/link';
import Image from 'next/image';

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
  const date = post.published_at
    ? new Date(post.published_at)
    : new Date(post.created_at);

  return (
    <Link
      href={`/news/${post.slug}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {post.featured_image && (
        <div className="relative h-48 w-full">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.author_name || 'Claim Records'}</span>
          <time>{date.toLocaleDateString()}</time>
        </div>
      </div>
    </Link>
  );
}

