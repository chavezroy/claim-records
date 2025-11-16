'use client';

interface Video {
  id: string;
  title: string;
  video_url: string;
  video_type: 'youtube' | 'vimeo' | 'upload';
  thumbnail_url?: string | null;
  description?: string | null;
}

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const getEmbedUrl = () => {
    if (video.video_type === 'youtube') {
      const videoId = video.video_url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (video.video_type === 'vimeo') {
      const videoId = video.video_url.match(/(?:vimeo\.com\/)(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return video.video_url;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      ) : (
        <video
          src={video.video_url}
          controls
          className="w-full h-full"
          poster={video.thumbnail_url || undefined}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

