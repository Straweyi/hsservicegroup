import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { fetchAllServicesServer } from "@/lib/services-store";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");

  const siteUrl = getSiteUrl();
  const services = await fetchAllServicesServer();

  const serviceEntries: MetadataRoute.Sitemap = services
    .filter((s) => s.category !== "tennis")
    .map((service) => ({
      url: `${siteUrl}/layanan/${service.id}`,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/tennis-coaching`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...serviceEntries,
  ];
}

