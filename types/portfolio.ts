export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  credits: string;
  thumbnailImage: string | null;
  // CSS object-position (e.g. "62% 30%") — where the image is focused
  // within its object-cover box, set via the admin's focal-point picker.
  thumbnailImagePosition: string;
  thumbnailLabel: string | null;
  videoName: string | null;
  videoLabel: string | null;
  videoPreviewImage: string | null;
  videoPreviewImagePosition: string;
  photos: string[];
  tags: string[];
  createdAt: string;
};
