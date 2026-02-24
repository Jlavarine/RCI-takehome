# Jobs Dashboard

Internal dashboard for field managers at a landscaping company. Managers use it to track job progress and keep crews on schedule. The app fetches active jobs from the Quickbase API and displays them with search, filtering by status, and at-a-glance breakdowns.

## What it does

- Fetches and displays jobs from Quickbase (table configured via env).
- Search by customer name, address, or crew (debounced).
- Summary boxes at the top for the four job categories: Overdue, Active (In Progress), Upcoming (Scheduled), Completed.
- Tabs to filter the table by the same categories; one table, content changes with the selected tab.
- Pagination for the filtered list.
- Overdue jobs called out in the table (row styling and days overdue).
- Last updated time and retry on API failure.

Built with Next.js (App Router), React, and TypeScript.

## Architecture and decisions

- **Structured data layer**: `api/quickbase.ts` does the fetch only; `types/job.ts` defines the job shape; `utils/jobs.ts` holds parsing and helpers (e.g. overdue, search normalize). That keeps API details, types, and business logic in one place each and easier to test or change.
- **Single `useJobs` hook**: Loading, error, and “last updated” live in one hook so the page stays simple and we get a clear place for retry and cache behavior later if needed.
- **Defensive parsing**: Quickbase returns field IDs as keys and `{ value }` wrappers; we parse once into a flat `Job` type. Missing or invalid due dates are treated as “no due date” so nothing is wrongly marked overdue.
- **Debounced search**: The search input drives a debounced value (e.g. 200ms) so we only filter after the user pauses typing. That keeps typing responsive and avoids filtering the full list on every keystroke.
- **Tabs and one table**: Jobs are bucketed into Overdue, Active, Upcoming, Completed. Tabs filter which bucket is shown; a single table displays the current bucket so the UI stays consistent and the breakdown (summary boxes + tabs) matches the same categories.
- **Summary boxes instead of a chart**: Four horizontal boxes (one per category) show count and share of total. That makes each category’s numbers readable at a glance without interpreting a chart.

## Run locally

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Add a `.env.local` file in the project root with your Quickbase credentials:

```
NEXT_PUBLIC_QUICKBASE_REALM=your-realm-subdomain
NEXT_PUBLIC_QUICKBASE_TOKEN=your-user-token
NEXT_PUBLIC_QUICKBASE_TABLE_ID=your-table-id
```

- **Realm**: The subdomain only (e.g. `mycompany` for `mycompany.quickbase.com`).
- **Token**: From Quickbase > My Preferences > Manage User Tokens.
- **Table ID**: The table’s ID from the Quickbase app URL when viewing that table.

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

To get field IDs for your table (for schema reference or debugging), use the Quickbase API:

```bash
curl -X GET 'https://api.quickbase.com/v1/fields?tableId=YOUR_TABLE_ID' \
  -H 'QB-Realm-Hostname: YOUR_REALM.quickbase.com' \
  -H 'Authorization: QB-USER-TOKEN YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

## Future improvements

- **Urgent jobs (due soon)**: If a job’s due date is within 3 days and its status is not “In Progress”, mark it as urgent in the UI (e.g. badge or row styling) so it stands out and is less likely to become overdue.
- **Notes column in the table**: Add a dedicated notes column (or expandable notes) for each job. In the source data, notes are sometimes stored or attached to the customer name field; surfacing them in a proper notes section would make them easier to use in the dashboard.
- **Better handling of missing data**: Instead of showing “—” for missing fields (customer name, address, etc.), use tailored prompts such as “Call customer”, “Request address”, or “Add crew” so the UI nudges the next action instead of looking like empty data.
- **Cypress e2e tests**: Add end-to-end tests with Cypress to cover API mocking, error handling (e.g. failed fetch and retry), main UI flows (tabs, search, pagination), and regression checks so changes are less likely to introduce bugs.
