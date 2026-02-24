import type { Job, QuickbaseJobRecord } from "@/types/job";

/** Quickbase field IDs for this table */
const F = {
  CUSTOMER_NAME: "6",
  ADDRESS: "7",
  SCHEDULED_DATE: "8",
  STATUS: "9",
  CREW: "10",
  JOB_TYPE: "11",
  NOTES: "12",
  PHONE: "13",
  PRIORITY: "14",
} as const;

function getField(raw: QuickbaseJobRecord, fieldId: string): unknown {
  const cell = raw[fieldId];
  if (cell == null || typeof cell !== "object") return undefined;
  return "value" in cell ? cell.value : undefined;
}

function str(v: unknown): string {
  if (v == null) return "";
  const s = String(v).trim();
  return s;
}

/**
 * Parse a value to a valid Date or null (handles missing, null, invalid formats).
 */
export function parseSafeDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  const d = new Date(value as string | number);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * True only when job has a valid due date and it is in the past.
 */
export function isOverdue(job: Job): boolean {
  if (!job.dueDate) return false;
  return job.dueDate.getTime() < Date.now();
}

/**
 * Days past due (positive) or 0 if not overdue / no due date.
 */
export function daysOverdue(job: Job): number {
  if (!job.dueDate || !isOverdue(job)) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((Date.now() - job.dueDate.getTime()) / msPerDay);
}

/** Bucket for gauge: overdue vs due this week vs due later */
export type DueBucket = "overdue" | "due_this_week" | "due_later";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Bucket a job for the summary gauge (overdue, due in next 7 days, or later/no date).
 */
export function getDueBucket(job: Job): DueBucket {
  if (!job.dueDate) return "due_later";
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const dueTime = job.dueDate.getTime();
  const todayStartTime = todayStart.getTime();
  if (dueTime < todayStartTime) return "overdue";
  const weekEnd = todayStartTime + 7 * MS_PER_DAY;
  if (dueTime < weekEnd) return "due_this_week";
  return "due_later";
}

/**
 * Count jobs in each due bucket for the gauge.
 */
export function getDueBucketCounts(jobs: Job[]): Record<DueBucket, number> {
  const counts: Record<DueBucket, number> = {
    overdue: 0,
    due_this_week: 0,
    due_later: 0,
  };
  for (const job of jobs) {
    counts[getDueBucket(job)] += 1;
  }
  return counts;
}

/** Tab filter: each job belongs to exactly one tab for the table view */
export type JobTab = "overdue" | "active" | "upcoming" | "completed";

function normalizeStatus(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Assign each job to exactly one tab (overdue > completed > active > upcoming).
 */
export function getJobTab(job: Job): JobTab {
  const status = normalizeStatus(job.status);
  if (isOverdue(job)) return "overdue";
  if (status === "completed") return "completed";
  if (status === "in progress") return "active";
  if (status === "scheduled") return "upcoming";
  return "upcoming";
}

/**
 * Count jobs per tab for the tab labels.
 */
export function getJobTabCounts(jobs: Job[]): Record<JobTab, number> {
  const counts: Record<JobTab, number> = {
    overdue: 0,
    active: 0,
    upcoming: 0,
    completed: 0,
  };
  for (const job of jobs) {
    counts[getJobTab(job)] += 1;
  }
  return counts;
}

/**
 * Normalize text for search matching (trim, lowercase, collapse spaces).
 */
export function normalizeSearchText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Map a raw Quickbase record to a normalized Job (defensive parsing).
 * Pass index when record id is not available for a stable React key.
 */
export function parseJob(raw: QuickbaseJobRecord, index: number): Job {
  const name = str(getField(raw, F.CUSTOMER_NAME)) || "—";
  const dueDate = parseSafeDate(getField(raw, F.SCHEDULED_DATE));
  return {
    id: String(index),
    name,
    dueDate,
    address: str(getField(raw, F.ADDRESS)),
    status: str(getField(raw, F.STATUS)),
    crew: str(getField(raw, F.CREW)),
    jobType: str(getField(raw, F.JOB_TYPE)),
    notes: str(getField(raw, F.NOTES)),
    phone: str(getField(raw, F.PHONE)),
    priority: str(getField(raw, F.PRIORITY)),
  };
}
