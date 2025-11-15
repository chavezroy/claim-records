import { Release } from '@/lib/types/release';

export const releases: Release[] = [
  // The Belt releases
  {
    id: 'tb-power',
    title: 'Power Set',
    slug: 'power-set',
    artistId: 'the-belt',
    artistName: 'The Belt',
    type: 'ep',
    artwork: '/img/artist/release/tb-power.png',
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      amazon: '#',
      youtube: '#',
    },
  },
  {
    id: 'tb-southern',
    title: 'Southern Living.... not the magazine',
    slug: 'southern-living',
    artistId: 'the-belt',
    artistName: 'The Belt',
    type: 'single',
    artwork: '/img/artist/release/tb-southern.png',
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      amazon: '#',
      youtube: '#',
    },
  },
  {
    id: 'tb-story',
    title: "Story of a dog's life",
    slug: 'story-of-a-dogs-life',
    artistId: 'the-belt',
    artistName: 'The Belt',
    type: 'single',
    artwork: '/img/artist/release/tb-story.png',
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      amazon: '#',
      youtube: '#',
    },
  },
  // Final Generation releases
  {
    id: 'fg-last-goodbye',
    title: 'Last Goodbye',
    slug: 'last-goodbye',
    artistId: 'final-generation',
    artistName: 'Final Generation',
    type: 'album',
    artwork: '/img/artist/release/fg-lg.png',
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      amazon: '#',
      youtube: '#',
    },
  },
  // Extrapolate releases
  {
    id: 'ex-shadeauxx',
    title: 'Shadeauxx Shift',
    slug: 'shadeauxx-shift',
    artistId: 'extrapolate',
    artistName: 'Extrapolate',
    type: 'ep',
    artwork: '/img/artist/release/ex-shadeauxx.png',
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      amazon: '#',
      youtube: '#',
    },
  },
];

export function getReleasesByArtist(artistId: string): Release[] {
  return releases.filter((release) => release.artistId === artistId);
}

export function getFeaturedReleases(): Release[] {
  const featuredIds = ['tb-southern', 'fg-last-goodbye', 'ex-shadeauxx', 'tb-power'];
  return releases.filter((r) => featuredIds.includes(r.id));
}

