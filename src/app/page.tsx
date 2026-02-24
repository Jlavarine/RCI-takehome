"use client";

import "./dashboard.css";
import { useMemo, useState, useEffect } from "react";
import { useJobs } from "../hooks/useJobs";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  isOverdue,
  normalizeSearchText,
  getJobTab,
  getJobTabCounts,
  type JobTab,
} from "../utils/jobs";
import { JobsGauge, type GaugeBucket } from "../components/JobsGauge";
import { DashboardToolbar } from "../components/DashboardToolbar";
import { DashboardSummary } from "../components/DashboardSummary";
import { JobsTabs } from "../components/JobsTabs";
import { JobsTable } from "../components/JobsTable";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 25;
const TAB_ORDER: JobTab[] = ["overdue", "active", "upcoming", "completed"];

export default function DashboardPage() {
  const { jobs, loading, error, lastFetchedAt, refetch } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState<JobTab>("overdue");
  const debouncedSearch = useDebouncedValue(searchQuery, 200);

  const filteredJobs = useMemo(() => {
    const norm = normalizeSearchText(debouncedSearch);
    if (!norm) return jobs;
    return jobs.filter((j) => {
      const searchable =
        [j.name, j.address, j.crew].map(normalizeSearchText).join(" ");
      return searchable.includes(norm);
    });
  }, [jobs, debouncedSearch]);

  const gaugeBuckets = useMemo((): GaugeBucket[] => {
    const counts = getJobTabCounts(filteredJobs);
    const total = filteredJobs.length;
    if (total === 0)
      return TAB_ORDER.map((bucket) => ({
        bucket,
        count: 0,
        percent: 0,
      }));
    return TAB_ORDER.map((bucket) => ({
      bucket,
      count: counts[bucket],
      percent: (counts[bucket] / total) * 100,
    }));
  }, [filteredJobs]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }, [filteredJobs]);

  const tabCounts = useMemo(() => getJobTabCounts(filteredJobs), [filteredJobs]);

  const tabbedJobs = useMemo(
    () => sortedJobs.filter((j) => getJobTab(j) === selectedTab),
    [sortedJobs, selectedTab]
  );

  const totalPages = Math.max(1, Math.ceil(tabbedJobs.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedJobs = useMemo(
    () => tabbedJobs.slice(start, start + PAGE_SIZE),
    [tabbedJobs, start]
  );

  const overdueCount = useMemo(
    () => tabbedJobs.filter((j) => isOverdue(j)).length,
    [tabbedJobs]
  );

  useEffect(() => setPage(1), [debouncedSearch, selectedTab]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <main className="dashboard">
      <DashboardToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lastFetchedAt={lastFetchedAt}
      />

      {error && (
        <div className="dashboard-error">
          <p>{error.message}</p>
          <button type="button" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p className="dashboard-loading">Loading jobs…</p>
      ) : (
        <>
          <section className="dashboard-gauge-section" aria-label="Job breakdown">
            <JobsGauge
              buckets={gaugeBuckets}
              total={filteredJobs.length}
            />
          </section>

          <JobsTabs
            activeTab={selectedTab}
            counts={tabCounts}
            onTabChange={setSelectedTab}
          />

          <DashboardSummary
            start={tabbedJobs.length === 0 ? 0 : start + 1}
            end={Math.min(start + PAGE_SIZE, tabbedJobs.length)}
            total={tabbedJobs.length}
            overdueCount={overdueCount}
          />

          <div id="jobs-table-panel" role="tabpanel" aria-labelledby={`tab-${selectedTab}`}>
            <JobsTable jobs={paginatedJobs} />
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}
