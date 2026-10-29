"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SITE_SETTINGS,
  fetchActiveFaqsClient,
  fetchActiveTestimonialsClient,
  fetchSiteSettingsClient,
  getDefaultFaqRows,
  getDefaultTestimonialRows,
  type FaqRow,
  type SiteSettingsRow,
  type TestimonialRow,
} from "@/lib/cms-store";

let cachedTestimonials: TestimonialRow[] | null = null;
let cachedFaqs: FaqRow[] | null = null;
let cachedSettings: SiteSettingsRow | null = null;

export function invalidateCmsCache() {
  cachedTestimonials = null;
  cachedFaqs = null;
  cachedSettings = null;
}

export function useTestimonials() {
  const [items, setItems] = useState<TestimonialRow[]>(
    cachedTestimonials ?? getDefaultTestimonialRows()
  );

  useEffect(() => {
    let mounted = true;
    fetchActiveTestimonialsClient().then((res) => {
      cachedTestimonials = res;
      if (mounted) setItems(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return items;
}

export function useFaqs() {
  const [items, setItems] = useState<FaqRow[]>(cachedFaqs ?? getDefaultFaqRows());

  useEffect(() => {
    let mounted = true;
    fetchActiveFaqsClient().then((res) => {
      cachedFaqs = res;
      if (mounted) setItems(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return items;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsRow>(
    cachedSettings ?? DEFAULT_SITE_SETTINGS
  );

  useEffect(() => {
    let mounted = true;
    fetchSiteSettingsClient().then((res) => {
      cachedSettings = res;
      if (mounted) setSettings(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}

