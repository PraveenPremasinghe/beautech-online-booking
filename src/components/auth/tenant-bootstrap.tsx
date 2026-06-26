"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { initClientIdFromSearchParams } from "@/lib/tenant";

export function TenantBootstrap() {
  const searchParams = useSearchParams();

  useEffect(() => {
    initClientIdFromSearchParams(searchParams);
  }, [searchParams]);

  return null;
}
