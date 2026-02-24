"use client";

interface DashboardSummaryProps {
  start: number;
  end: number;
  total: number;
  overdueCount: number;
}

export function DashboardSummary({
  start,
  end,
  total,
  overdueCount,
}: DashboardSummaryProps) {
  return (
    <div className="dashboard-summary">
      <span>
        {total === 0
          ? "No jobs"
          : `Showing ${start}–${end} of ${total}`}
      </span>
      {overdueCount > 0 && (
        <strong className="dashboard-overdue-badge">
          {overdueCount} overdue
        </strong>
      )}
    </div>
  );
}
