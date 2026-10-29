"use client";

import { useEffect, useState } from "react";
import { services as defaultServices, type Service } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { fetchActiveServicesClient } from "@/lib/services-store";

let cachedServices: Service[] | null = null;

export function invalidateServicesCache() {
  cachedServices = null;
}

export function useServices() {
  const [items, setItems] = useState<Service[]>(cachedServices ?? defaultServices);
  const [loading, setLoading] = useState<boolean>(!cachedServices && Boolean(supabase));

  useEffect(() => {
    let mounted = true;
    fetchActiveServicesClient().then((res) => {
      cachedServices = res;
      if (mounted) {
        setItems(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { services: items, loading };
}

