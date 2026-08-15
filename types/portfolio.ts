export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  credits: string;
  thumbnailImage: string | null;
  thumbnailLabel: string | null;
  videoName: string | null;
  videoLabel: string | null;
  videoPreviewImage: string | null;
  photos: string[];
  tags: string[];
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};
