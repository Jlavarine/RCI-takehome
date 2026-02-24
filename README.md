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
