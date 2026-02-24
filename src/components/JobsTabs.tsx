"use client";

import type { JobTab } from "../utils/jobs";

export const TAB_LABELS: Record<JobTab, string> = {
  overdue: "Overdue",
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
};

const TAB_ORDER: JobTab[] = ["overdue", "active", "upcoming", "completed"];

interface JobsTabsProps {
  activeTab: JobTab;
  counts: Record<JobTab, number>;
  onTabChange: (tab: JobTab) => void;
}

export function JobsTabs({ activeTab, counts, onTabChange }: JobsTabsProps) {
  return (
    <div className="jobs-tabs" role="tablist" aria-label="Filter jobs by status">
      {TAB_ORDER.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls="jobs-table-panel"
          id={`tab-${tab}`}
          className={`jobs-tabs__tab ${activeTab === tab ? "jobs-tabs__tab--active" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          <span className="jobs-tabs__label">{TAB_LABELS[tab]}</span>
        </button>
      ))}
    </div>
  );
}
