"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase";

interface RequireAuthProps {
  children: ReactNode;
  /** When set, verifies the user's profile has this role before granting access. */
  requiredRole?: "admin" | "visitor";
}

/**
 * Client-side route guard. Shows a spinner while loading, redirects to /auth
 * if no session, and optionally checks the user's role in the `profiles` table.
 */
export function RequireAuth({ children, requiredRole }: RequireAuthProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [roleOk, setRoleOk] = useState(!requiredRole);
  const [roleLoading, setRoleLoading] = useState(!!requiredRole);

  useEffect(() => {
    if (authLoading || !requiredRole || !user) return;
    const uid = user.id;
    if (!uid) return;

    let cancelled = false;
    const db = getSupabase();
    db
      .from("profiles")
      .select("role")
      .eq("id", uid)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || data?.role !== requiredRole) {
          router.replace("/auth");
        } else {
          setRoleOk(true);
        }
        setRoleLoading(false);
      });

    return () => { cancelled = true; };
  }, [authLoading, user, requiredRole, router]);

  // Redirect to /auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !roleOk) return null;

  return <>{children}</>;
}
