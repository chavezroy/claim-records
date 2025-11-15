import { Artist } from '@/lib/types/artist';

export const artists: Artist[] = [
  {
    id: 'the-common-good',
    name: 'The Common Good',
    slug: 'the-common-good',
    image: '/img/artist/_commongood.jpg',
    profileImage: '/img/artist/profile/main-extrapolate.jpg', // placeholder
  },
  {
    id: 'the-belt',
    name: 'The Belt',
    slug: 'the-belt',
    image: '/img/artist/_belt1.jpg',
    profileImage: '/img/artist/profile/main-thebelt.jpg',
  },
  {
    id: 'extrapolate',
    name: 'Extrapolate',
    slug: 'extrapolate',
    image: '/img/artist/_shadeauxx.jpg',
    profileImage: '/img/artist/profile/main-extrapolate.jpg',
  },
  {
    id: 'final-generation',
    name: 'Final Generation',
    slug: 'final-generation',
    image: '/img/artist/_lastgoodbye.jpg',
    profileImage: '/img/artist/profile/main-fg.jpg',
  },
  {
    id: 'joe-strange',
    name: 'Joe Strange',
    slug: 'joe-strange',
    image: '/img/artist/_strange.jpg',
    profileImage: '/img/artist/_strange.jpg',
  },
  {
    id: 'pigsney-charmer',
    name: 'Pigsney Charmer',
    slug: 'pigsney-charmer',
    image: '/img/artist/_shesaved.jpg',
    profileImage: '/img/artist/profile/main-pigsneycharmer.jpg',
  },
];

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

