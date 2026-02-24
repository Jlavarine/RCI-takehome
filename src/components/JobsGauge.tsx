"use client";

import type { DueBucket } from "@/utils/jobs";

const BUCKET_LABELS: Record<DueBucket, string> = {
  overdue: "Overdue",
  due_this_week: "Due this week",
  due_later: "Due later",
};

const BUCKET_COLORS: Record<DueBucket, string> = {
  overdue: "#b91c1c",
  due_this_week: "#b45309",
  due_later: "#15803d",
};

export interface GaugeBucket {
  bucket: DueBucket;
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
        <div className="jobs-gauge__donut jobs-gauge__donut--empty">
          <div className="jobs-gauge__hole" />
        </div>
        <p className="jobs-gauge__empty">No jobs</p>
      </div>
    );
  }

  let acc = 0;
  const stops = buckets
    .filter((b) => b.count > 0)
    .map((b) => {
      const start = acc;
      acc += b.percent;
      return {
        ...b,
        startPercent: start,
        endPercent: acc,
      };
    });

  const gradientStops = stops
    .map(
      (s) =>
        `${BUCKET_COLORS[s.bucket]} ${s.startPercent}% ${s.endPercent}%`
    )
    .join(", ");
  const conicGradient = `conic-gradient(from 0deg, ${gradientStops})`;

  return (
    <div
      className="jobs-gauge"
      role="img"
      aria-label={`Job breakdown: ${total} total. ${buckets.map((b) => `${b.count} ${BUCKET_LABELS[b.bucket].toLowerCase()}`).join(", ")}`}
    >
      <div className="jobs-gauge__donut" style={{ background: conicGradient }}>
        <div className="jobs-gauge__hole">
          <span className="jobs-gauge__total">{total.toLocaleString()}</span>
          <span className="jobs-gauge__total-label">jobs</span>
        </div>
      </div>
      <ul className="jobs-gauge__legend" aria-hidden>
        {buckets.map((b) => (
          <li key={b.bucket} className="jobs-gauge__legend-item">
            <span
              className="jobs-gauge__swatch"
              style={{ backgroundColor: BUCKET_COLORS[b.bucket] }}
            />
            <span className="jobs-gauge__legend-label">
              {BUCKET_LABELS[b.bucket]}
            </span>
            <span className="jobs-gauge__legend-value">
              {b.count} ({b.percent.toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
