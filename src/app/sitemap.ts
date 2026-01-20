import type { MetadataRoute } from "next";
import { getPublicPosts } from "@/lib/blog-data";
import { locales } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const staticPaths = ["/home", "/blog", "/privacy-policy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPublicPosts();

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "/blog" ? "weekly" : "monthly",
      priority: path === "/home" ? 1 : path === "/blog" ? 0.8 : 0.3,
    }))
  );

  const blogEntries = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...blogEntries];
}
