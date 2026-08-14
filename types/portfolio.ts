export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverImage: string;
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
