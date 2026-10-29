# CLAUDE.md — School Counselor Associate System (Frontend)

Stack: React 19 + Vite, Redux Toolkit (state), Tailwind CSS v4, Axios.

## Project Overview
A secure and maintainable system that helps school staff manage student support services, counseling appointments, student records, and follow-ups.

Before building a feature, inspect the existing structure, docs, and code. Do not assume requirements that are not confirmed.

## Role
- Act as a **Mid Level Software Engineer**.

## Code Rules
- **Do not over code (HARD priority).** Build only what is asked.
- **All files in `src/` must be `.jsx`** (components, hooks, services, store, utils). Do not create `.js` files. Only root config files (`vite.config.js`, `eslint.config.js`) stay `.js`.
- Keep files short. **Max 500 lines per file** — split into smaller components/hooks when it grows.
- Write clean, simple code that an entry level dev can read and follow without Claude.
- Follow **DRY** — reuse existing components, hooks, services, and helpers.
- Comments: short and specific only. No long comments.
- Follow the existing stack, naming conventions, and error handling.
- Keep business logic out of UI components (put it in services/hooks).
- Do not rewrite or refactor unrelated code.
- Do not remove existing features unless asked.
- Never invent API endpoints, fields, or business rules. Ask first.
- Make changes in small, testable steps.

## Design
- Minimalist design.
- **All features must be responsive** on every screen size (mobile, tablet, desktop). Use a mobile-first approach with Tailwind breakpoints (`sm`, `md`, `lg`, `xl`).
- **Always use Tailwind** for styling. No custom CSS unless unavoidable.
- All buttons and clickable elements must have `cursor-pointer`.
- Buttons that trigger an API call (create, update, delete, etc.) must show a loading spinner inside the button. Use `<Button loading={...}>`.
- Deleting always asks for confirmation first (`ConfirmModal`).
- Successful create / update / delete shows a success toast (`toast.success()` from `react-toastify`). `useCrud(service, 'Label')` does this automatically.
- All calendars use the shared `Calendar` component. Forms use `DatePicker` (single date), filters use `DateRangePicker`. Never use native `<input type="date">`.
- Every table has an Export button (`ExportMenu`) with PDF, Excel and CSV, using `exportTable()` from `utils/export`. Define table columns once with a plain `value(row)` so the table and exports share them.
- All displayed dates use `formatDate()` from `utils/dateHelpers` (format: `Jun 03, 2026`).
- Text form fields use `FormField`. If a Settings category has the same name as the field label (e.g. "Grade & Section", "Sex"), it shows a select with the Settings options.
- Theme colors (Light / Dark / Custom palettes in `index.css`): use `bg-surface` (not `bg-white`), `bg-page`, `bg-primary` / `hover:bg-primary-hover`, and `*-brand-*` for accents. Use `gray-*` for text/borders so dark mode works.
- Use skeleton loaders while data is loading.
- Optimize images: `loading="lazy"`, set `width`/`height`, use compressed formats (WebP).

## State Management
- Use Redux Toolkit for shared state. Avoid prop drilling.
- Passing props 1 level down (parent → child) is fine; use the store when data goes deeper or is shared.

## API
- Keep API code separate from UI:
  - `src/api/axios.jsx` — axios instance (base URL, headers, interceptors).
  - `src/api/routes.jsx` — endpoint paths.
  - `src/services/` — one file per feature with the fetch functions (e.g. `userService.jsx`).
- Pages must not call axios directly. Use a service or a custom hook (e.g. `useUsers`) so pages stay small.
- Use pagination, filtering, sorting, and search where needed.
- Show friendly error messages. Never show raw/internal errors to users.
- Never store secrets or credentials in code. Use `.env` (`VITE_*`).

## Layouts
- Use layout components to wrap pages:
  - `MainLayout` — navbar, footer, main content.
  - `AuthLayout` — login/register pages.
  - Add more only when needed.

## Folder Structure
```
src/
├── api/            # axios instance + routes
├── assets/         # images, icons
├── components/
│   ├── ui/         # reusable UI (Button, Input, Skeleton)
│   └── common/     # shared parts (Navbar, Footer)
├── hooks/          # custom hooks (data fetching, etc.)
├── layouts/        # MainLayout, AuthLayout
├── pages/          # one folder per page
├── routes/         # app routing
├── services/       # API calls per feature
├── store/          # Redux store + slices
├── utils/          # small helper functions
├── App.jsx
└── main.jsx
```

## Core Modules (proposed — confirm before building)
- Authentication and user management
- Role-based access control
- Student profile management
- Counseling appointment scheduling
- Counseling session records
- Student referrals and follow-up tracking
- Counselor availability and schedules
- Notifications and reminders
- Dashboard and reports
- Audit logs for sensitive record access and changes
- System settings

## Security and Privacy
- Protect student info and confidential counseling records.
- Hide pages/actions the user's role can't access. The backend must still enforce authorization — frontend checks are UI only.
- Least privilege: only show sensitive records to authorized roles.
- Validate user input on forms (the server must validate too).
- Store auth tokens safely and clear them on logout.
- Do not show confidential counseling notes in general student views, notifications, or reports.
- Never log (`console.log`) passwords, tokens, or counseling content.
- Retention, deletion, consent, and emergency disclosure rules must be confirmed with the school first.
- Follow privacy laws and school policies. Do not claim legal compliance without verification.

## Backend Notes (for the API team / backend repo)
- Inspect the schema before changing the database. Use migrations.
- Add proper foreign keys, indexes, constraints, and transactions.
- Block access to records of other students or counselors.
- Keep API responses consistent. Use HTTPS in production and protect sensitive data at rest.
- Record audit events for viewing, creating, updating, exporting, and deleting sensitive records.
- Document each endpoint: method, path, auth, permissions, request fields, response, errors.

## Testing
- Write or update tests for every new feature.
- Test success, validation failures, unauthorized access, and edge cases.
- Test role permissions and access to other students' records.
- Run the tests and report the real results. Never say a test passed unless it actually ran and passed.

## Workflow
For every task:
1. Inspect the related files and current code.
2. Briefly explain the approach.
3. List affected files.
4. Implement only the requested feature.
5. Test it.
6. Review security, validation, authorization, and regressions.
7. Update relevant docs.
8. Summarize changed files, tests run, and remaining issues.

If requirements are unclear, ask before assuming.
