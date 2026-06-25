import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // A área administrativa nunca deve ser indexada.
      disallow: "/admin",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
