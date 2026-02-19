import matter from 'gray-matter';
import { Post } from '../types';
import { format, parseISO } from 'date-fns';

export async function getAllPosts(): Promise<Post[]> {
  // Vite's import.meta.glob with `{ as: 'raw' }` imports files as strings.
  const modules = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' });
  const postPromises = Object.entries(modules).map(async ([_path, resolver]) => {
    const rawContent = await (resolver as () => Promise<string>)();
    const { data, content } = matter(rawContent);
    return { data, content };
  });

  const allPostData = await Promise.all(postPromises);

  const posts = allPostData
    // Filter out drafts in production
    .filter(({ data }) => !(import.meta.env.PROD && data.draft))
    // Sort posts by date in descending order
    .sort((a, b) => {
      const dateA = new Date(a.data.date).getTime();
      const dateB = new Date(b.data.date).getTime();
      return dateB - dateA;
    })
    // Map to the final Post structure
    .map(({ data, content }): Post => ({
      slug: data.slug,
      title: data.title,
      date: format(parseISO(data.date), 'yyyy年MM月dd日'),
      category: data.category,
      tags: data.tags || [],
      excerpt: data.excerpt,
      draft: data.draft || false,
      content: content,
      image: data.image,
    }));

  return posts;
}
