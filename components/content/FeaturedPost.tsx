import Link from 'next/link';
import Image from 'next/image';

interface FeaturedPostProps {
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

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const date = post.published_at
    ? new Date(post.published_at)
    : new Date(post.created_at);

  return (
    <div className="relative bg-gray-900 text-white rounded-lg overflow-hidden">
      {post.featured_image && (
        <div className="absolute inset-0">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover opacity-50"
          />
        </div>
      )}
      <div className="relative p-8 md:p-12">
        <Link href={`/news/${post.slug}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 hover:text-indigo-300 transition-colors">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-lg text-gray-200 mb-6 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <span>{post.author_name || 'Claim Records'}</span>
            <span className="mx-2">•</span>
            <time>{date.toLocaleDateString()}</time>
          </div>
          <Link
            href={`/news/${post.slug}`}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md font-medium transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

