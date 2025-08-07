import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const englishPosts = posts.filter(post => !post.id.startsWith('fr/'));
  
  return rss({
    title: 'AI & Machine Learning Blog',
    description: 'A blog about artificial intelligence and machine learning',
    site: context.site,
    items: englishPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}