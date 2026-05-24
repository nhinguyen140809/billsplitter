# 💰 Bill Splitter

*Fair & simple expense sharing for groups — no account required.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://nhinguyen140809.github.io/BillSplitting/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

---

## 📌 Overview

Bill Splitter is a client-side web application for tracking and settling shared expenses in a group — meals, trips, household costs, or any debt between people. It records who paid what, calculates each person's fair share, and then uses a **Mixed-Integer Linear Program (MILP)** to find the minimum number of transactions needed to settle all debts at once.

Everything runs in the browser. No server, no sign-up, no data leaves the device.

---

## 🚀 Features

| | |
|---|---|
| ✔️ **Equal & unequal splits** | Divide a bill evenly or assign custom amounts per person |
| ✔️ **MILP transaction optimisation** | Minimises the number of payments needed to settle all debts |
| ✔️ **Non-blocking calculation** | LP solver runs in a dedicated Web Worker — the UI never freezes |
| ✔️ **Multiple settlements** | Separate workspaces for different groups or occasions |
| ✔️ **Persistent local storage** | All data stored in IndexedDB via Dexie — survives page refresh |
| ✔️ **Schema migrations** | Dexie versioned upgrades keep old local data intact across app updates |
| ✔️ **Dark / light theme** | System-aware theme with manual toggle |
| ✔️ **No server required** | Zero network requests at runtime — all logic and data are local |

---

## 📖 How To Use

1. **Add participants** — enter the names of everyone sharing expenses.
2. **Add bills** — for each expense choose:
   - *Equal split*: total amount divided equally among selected participants.
   - *Unequal split*: manually assign how much each person owes.
3. **Calculate** — the app solves the MILP and shows the minimum set of payments.
4. **Settle** — participants pay each other according to the result.
5. **Save** — save the settlement to revisit or export later; start fresh any time.

---

## 🛠️ Tech Stack

| Category | Library / Tool | Version |
|---|---|---|
| **Runtime** | React | 19 |
| **Language** | TypeScript | 5.9 |
| **Build tool** | Vite | 7 |
| **Styling** | Tailwind CSS | 4 |
| **UI components** | shadcn/ui + Radix UI | — |
| **Animations** | Framer Motion | 12 |
| **Local database** | Dexie (IndexedDB) + dexie-react-hooks | 4 |
| **Forms** | react-hook-form | 7 |
| **Validation** | Zod | 4 |
| **Routing** | React Router DOM | 7 |
| **LP solver** | javascript-lp-solver | 1 |
| **Background processing** | Web Worker (native browser API, bundled via Vite) | — |
| **Icons** | Lucide React | — |
| **Theme** | next-themes | — |
| **Linting** | ESLint 9 (flat config) + typescript-eslint | 9 |
| **Formatting** | Prettier + prettier-plugin-tailwindcss | 3 |

---

## 🏗️ Code Organisation

Feature-based structure — each domain owns its components, hooks, and schema.

```
src/
├── components/
│   ├── shared/          # App-wide layout (AppHeader, AppFooter, Section, Popup…)
│   └── ui/              # shadcn/ui primitives (Button, Select, ScrollArea…)
│
├── context/             # SettlementContext — unified draft/saved provider pattern
│
├── db/                  # Dexie DB class + versioned schema migrations (v1 → v3)
│
├── features/
│   ├── bill/
│   │   ├── components/  # BillForm, BillList, EqualBillSplit, UnequalBillSplit
│   │   ├── context/     # BillFormContext (scoped to the modal)
│   │   ├── hooks/       # useBills, useBillForm
│   │   └── schemas/     # billFormSchema (Zod + cross-field superRefine)
│   ├── calculator/      # In-app numeric calculator overlay
│   ├── participants/    # Member input, list, useMembers hook
│   └── payments/        # Payment display, usePayments hook, SectionPayments
│
├── hooks/               # Shared hooks: useSettlement, useDraftSettlement,
│                        #   useSettlements, useCalculationWorker
│
├── lib/                 # Pure functions: calculateSettlement, utils
│
├── pages/               # Route-level components (HomePage, SettlementsPage,
│                        #   SettlementDetailPage)
│
├── repositories/        # settlementRepo — single Dexie data-access layer
│
├── routes/              # React Router config
├── types/               # Shared TypeScript interfaces
└── workers/             # settlementCalculator.worker.ts (LP solver thread)
```

---

## ⚙️ Implementation Highlights

### MILP transaction optimisation
Rather than a greedy algorithm, the settlement engine formulates a Mixed-Integer Linear Program:
- **Continuous variables** `x_ij` — amount person *i* pays person *j*.
- **Binary variables** `w_ij` — whether *i* pays *j* at all (big-M constraint).
- **Objective** — minimise total number of non-zero transactions.

This guarantees the globally optimal settlement, not just a locally good one. The solver runs in `src/lib/calculateSettlement.ts` and is called exclusively from the Web Worker.

### Web Worker for non-blocking UI
The hook `useCalculationWorker` (in `src/hooks/`) spawns a dedicated worker on mount using Vite's `new Worker(new URL(...))` syntax, posts members and bills to it, and receives the result asynchronously — keeping animations and inputs fully responsive while the solver runs.

### Dexie + `useLiveQuery` for reactive local storage
All data lives in IndexedDB. `useLiveQuery` from `dexie-react-hooks` returns live, reactive queries — components re-render automatically when the database changes, without any manual subscription management.

### SettlementContext — single subscription per page
`SettlementContext` resolves the settlement once at page level; downstream feature hooks (`useMembers`, `useBills`, `usePayments`) consume the context instead of each subscribing independently. Two providers — `DraftSettlementProvider` and `SavedSettlementProvider` — give the same hook interface to both the home page (draft) and the detail page (saved settlement).

### Schema migrations
The Dexie DB class in `src/db/dexie.ts` maintains versioned upgrade scripts so existing IndexedDB data on users' devices is updated safely across app versions:
- **v2** — strips the `status` field from all settlement records.
- **v3** — removes `paid` / `spent` from stored members (computed at runtime only).

### react-hook-form + Zod validation
The bill form uses `react-hook-form` with a `zodResolver`. Cross-field rules — at least one participant selected, equal-split amount must be positive, unequal-split total must be non-zero — are encoded in a single `superRefine` on the schema, keeping validation logic out of component code.

---

## 🆕 What's New — v2.0

- **Web Worker** — LP solver moved off the main thread; the calculate button now shows a real async spinner.
- **react-hook-form + Zod** — replaced manual `useState` form management with a typed schema-validated form.
- **SettlementContext** — unified provider pattern, halved the number of IndexedDB subscriptions per page.
- **StoredMember type** — `paid` / `spent` are no longer persisted; computed fresh on each calculation.
- **Dexie v2 + v3 migrations** — existing local data upgrades automatically.
- **Removed section gating** — all sections (participants, bills, payments) are always interactive; no more linear unlock flow.
- **Inlined single-use components** — small presentational wrappers that were only used in one place moved inline, reducing file count without sacrificing readability.

---

## 💻 Getting Started

```bash
# Clone
git clone https://github.com/nhinguyen140809/BillSplitting.git
cd BillSplitting

# Install dependencies
npm install

# Start dev server
npm run dev
```

Other scripts:

| Command | Description |
|---|---|
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run release` | Lint → build → deploy to GitHub Pages |

---

*© 2026 YenNhi — All data stored locally in your browser.*
