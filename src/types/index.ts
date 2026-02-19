export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  draft?: boolean;
  content: string;
  image?: string;
}
