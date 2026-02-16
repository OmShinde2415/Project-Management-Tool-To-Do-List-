"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { User } from "../types";

export const useRequireAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (_error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    void checkAuth();
  }, [router]);

  return { user, loading };
};
