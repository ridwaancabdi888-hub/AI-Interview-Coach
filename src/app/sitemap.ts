import type { MetadataRoute } from "next";

const productionUrl = "https://ai-interview-coach-sigma-bay.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : productionUrl;

  return [
    {
      url: `${base}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
