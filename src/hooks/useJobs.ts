"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchJobs } from "@/api/quickbase";
import type { Job } from "@/types/job";
import { parseJob } from "@/utils/jobs";

export interface UseJobsResult {
  jobs: Job[];
  loading: boolean;
  error: Error | null;
  lastFetchedAt: Date | null;
  refetch: () => Promise<void>;
}

export function useJobs(): UseJobsResult {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await fetchJobs();
      setJobs(raw.map((r, i) => parseJob(r, i)));
      setLastFetchedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { jobs, loading, error, lastFetchedAt, refetch: load };
}
