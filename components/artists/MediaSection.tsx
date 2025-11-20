import { query } from '@/lib/db';
import AudioPlayer from './AudioPlayer';
import VideoGallery from './VideoGallery';
import ImageGallery from './ImageGallery';

interface MediaSectionProps {
  artistId: string;
}

export default async function MediaSection({ artistId }: MediaSectionProps) {
  // Fetch artist media
  const mediaResult = await query(
    `SELECT am.*, m.file_path, m.mime_type
     FROM artist_media am
     LEFT JOIN media m ON am.media_id = m.id
     WHERE am.artist_id = $1
     ORDER BY am.display_order ASC, am.created_at ASC`,
    [artistId]
  );

  const allMedia = mediaResult.rows;

  // Separate by type
  const audioMedia = allMedia.filter((m: any) => m.media_type === 'audio');
  const videoMedia = allMedia.filter((m: any) => m.media_type === 'video');
  const galleryImages = allMedia.filter((m: any) => m.media_type === 'gallery' || m.media_type === 'image');

  // Fetch videos from videos table
  const videosResult = await query(
    'SELECT * FROM videos WHERE artist_id = $1 ORDER BY created_at DESC',
    [artistId]
  );

  const videos = videosResult.rows;

  return (
    <div className="space-y-12">
      {audioMedia.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Audio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioMedia.map((audio: any) => (
              <AudioPlayer
                key={audio.id}
                src={audio.embed_url || audio.file_path || ''}
                title={audio.title || undefined}
                artwork={audio.file_path || undefined}
              />
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && <VideoGallery videos={videos} />}

      {galleryImages.length > 0 && <ImageGallery images={galleryImages} />}
    </div>
  );
}

