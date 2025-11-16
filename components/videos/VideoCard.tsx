import Link from 'next/link';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  slug: string;
  video_url: string;
  video_type: 'youtube' | 'vimeo' | 'upload';
  thumbnail_url?: string | null;
  artist_name?: string | null;
  view_count?: number;
  created_at: Date | string;
}

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      href={`/videos/${video.slug}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-video bg-gray-900">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity">
          <svg
            className="w-12 h-12 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
        {video.artist_name && (
          <p className="text-sm text-gray-600 mb-2">{video.artist_name}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {video.view_count !== undefined && video.view_count > 0 && (
            <span>
              <i className="bi bi-eye me-1"></i>
              {video.view_count} views
            </span>
          )}
          <span>
            {new Date(video.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

