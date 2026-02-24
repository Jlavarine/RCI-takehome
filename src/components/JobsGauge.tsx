"use client";

import type { JobTab } from "../utils/jobs";
import { TAB_LABELS } from "./JobsTabs";

const BOX_COLORS: Record<JobTab, string> = {
  overdue: "#b91c1c",
  upcoming: "#b45309",
  active: "#15803d",
  completed: "#64748b",
};

export interface GaugeBucket {
  bucket: JobTab;
  count: number;
  percent: number;
}

interface JobsGaugeProps {
  buckets: GaugeBucket[];
  total: number;
}

export function JobsGauge({ buckets, total }: JobsGaugeProps) {
  if (total === 0) {
    return (
      <div className="jobs-gauge" aria-label="No jobs to display">
        {buckets.map((b) => (
          <div
            key={b.bucket}
            className="jobs-gauge__box"
            style={{ "--jobs-gauge-accent": BOX_COLORS[b.bucket] } as React.CSSProperties}
          >
            <span className="jobs-gauge__box-label">{TAB_LABELS[b.bucket]}</span>
            <span className="jobs-gauge__box-count">0</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="jobs-gauge"
      role="img"
      aria-label={`Job breakdown: ${total} total. ${buckets.map((b) => `${b.count} ${TAB_LABELS[b.bucket].toLowerCase()}`).join(", ")}`}
    >
      {buckets.map((b) => (
        <div
          key={b.bucket}
          className="jobs-gauge__box"
          style={{ "--jobs-gauge-accent": BOX_COLORS[b.bucket] } as React.CSSProperties}
        >
          <span className="jobs-gauge__box-label">{TAB_LABELS[b.bucket]}</span>
          <span className="jobs-gauge__box-count">{b.count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
