"use client";

interface DashboardToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  lastFetchedAt: Date | null;
}

function formatLastUpdated(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function DashboardToolbar({
  searchQuery,
  onSearchChange,
  lastFetchedAt,
}: DashboardToolbarProps) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>Jobs Dashboard</h1>
        {lastFetchedAt && (
          <p className="dashboard-meta">
            Last updated: {formatLastUpdated(lastFetchedAt)}
          </p>
        )}
      </div>
      <div className="dashboard-toolbar">
        <input
          type="search"
          placeholder="Search by customer, address, or crew..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search jobs"
          className="dashboard-search"
        />
      </div>
    </header>
  );
}
