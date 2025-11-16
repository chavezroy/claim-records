import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await query(
    `SELECT p.*, u.name as author_name
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     WHERE p.status = 'published'
     ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
     LIMIT 20`
  );

  const posts = result.rows;
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Claim Records News</title>
    <description>Latest news and updates from Claim Records</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map((post: any) => {
        const pubDate = post.published_at
          ? new Date(post.published_at).toUTCString()
          : new Date(post.created_at).toUTCString();
        const link = `${baseUrl}/news/${post.slug}`;
        const description = post.excerpt || post.content.substring(0, 200) + '...';

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author_name || 'Claim Records'}</author>
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

