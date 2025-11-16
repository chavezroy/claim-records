import VideoCard from './VideoCard';

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

interface VideoGridProps {
  videos: Video[];
  columns?: 2 | 3 | 4;
}

export default function VideoGrid({ videos, columns = 3 }: VideoGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No videos available.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

