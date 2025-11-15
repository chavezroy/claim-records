export type ReleaseType = 'single' | 'ep' | 'album';

export type Release = {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  artistName: string;
  type: ReleaseType;
  releaseDate?: string;
  artwork: string;
  description?: string;
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    amazon?: string;
  };
};

