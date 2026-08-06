"use client";

import {
  createContext, useCallback, useContext, useEffect, useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";

/** Known flags and their defaults (overridable in the admin panel). */
export const DEFAULT_SETTINGS: Record<string, string> = {
  show_ai_chat: "true",
  show_ai_tools: "true",
  track_analytics: "true",
  maintenance_mode: "false",
};

interface SiteSettingsContextValue {
  settings: Record<string, string>;
  refresh: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  refresh: async () => {},
});

/** Loads site_settings (RLS: public read) so features can honor flags. */
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key,value");
    if (data?.length) {
      setSettings((prev) => {
        const next = { ...prev };
        for (const row of data) next[row.key] = row.value ?? "";
        return next;
      });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteSettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

/** Persist a flag (admin-only writes are enforced by RLS). */
export async function setSiteSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
