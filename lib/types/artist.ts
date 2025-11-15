export type Artist = {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  image: string;
  profileImage: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
};

