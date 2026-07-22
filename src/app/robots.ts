import type { MetadataRoute } from "next";

const productionUrl = "https://ai-interview-coach-sigma-bay.vercel.app";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : productionUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/admin",
        "/analytics",
        "/dashboard",
        "/history",
        "/interviews",
        "/onboarding",
        "/profile",
        "/settings",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
