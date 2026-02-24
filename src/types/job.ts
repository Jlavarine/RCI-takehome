export type QuickbaseJobRecord = Record<string, { value?: unknown }>;

// Normalized job shape used across the app. API response is parsed into this type to handle missing/weird values.
export interface Job {
  id: string;
  // Customer name (field 6) 
  name: string;
  // Scheduled date — used for overdue (field 8). Missing/invalid = not overdue 
  dueDate: Date | null;
  //Address (field 7)
  address: string;
  // Status e.g. Scheduled, In Progress, Completed (field 9) 
  status: string;
  // Crew assigned (field 10) 
  crew: string;
  // Job type e.g. Mulch, Cut Blow & Edge (field 11) 
  jobType: string;
  // Notes (field 12) 
  notes: string;
  // Phone (field 13) 
  phone: string;
  // Priority e.g. Low, Medium, High (field 14) 
  priority: string;
}
