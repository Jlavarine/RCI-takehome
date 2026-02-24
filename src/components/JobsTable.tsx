"use client";

import { isOverdue, daysOverdue } from "@/utils/jobs";
import type { Job } from "@/types/job";

function formatDueDate(job: Job): string {
  if (!job.dueDate) return "—";
  return job.dueDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface JobsTableProps {
  jobs: Job[];
}

export function JobsTable({ jobs }: JobsTableProps) {
  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table" aria-label="Jobs">
        <thead>
          <tr>
            <th>Due date</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Crew</th>
            <th>Status</th>
            <th>Priority</th>
            <th aria-label="Overdue" />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JobRow({ job }: { job: Job }) {
  const overdue = isOverdue(job);
  const days = daysOverdue(job);

  return (
    <tr className={overdue ? "dashboard-row-overdue" : undefined}>
      <td className="dashboard-cell-due">{formatDueDate(job)}</td>
      <td className="dashboard-cell-customer">{job.name || "—"}</td>
      <td className="dashboard-cell-address">{job.address || "—"}</td>
      <td>{job.crew || "—"}</td>
      <td>{job.status || "—"}</td>
      <td>
        <span
          className={`dashboard-priority dashboard-priority-${(job.priority || "").toLowerCase()}`}
        >
          {job.priority || "—"}
        </span>
      </td>
      <td className="dashboard-cell-overdue">
        {overdue && days > 0 ? (
          <span className="dashboard-overdue-label">
            {days} day{days !== 1 ? "s" : ""}
          </span>
        ) : null}
      </td>
    </tr>
  );
}
