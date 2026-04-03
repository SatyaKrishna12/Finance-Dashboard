# Finance Dashboard

## Overview
This project is a responsive finance dashboard built with React and Vite. It presents account activity, spending insights, and transaction management in a role-aware interface intended for practical evaluation of UI/UX, engineering quality, and product thinking.

The implementation focuses on:
 - Clear information hierarchy for financial data
 - Responsive behavior across desktop and mobile breakpoints
 - Role-based interactions for admin and viewer users
 - Local persistence to preserve session state across reloads

## Core Features

### Dashboard and Insights
 - Summary cards for total balance, income, and expenses
 - Balance trend visualization
 - Spending breakdown donut chart with category legend and tooltip
 - Insight cards derived from transaction data

### Transactions
 - Search by merchant, category, date, and type
 - Filter by type, category, and date scope
 - Sorting by recency and amount
 - CSV export of current visible transactions

### Role-Based Access Behavior
 - `viewer`: read-only access
 - `admin`: create and edit transaction access

### Editing and Data Entry
 - Inline edit support in the transaction table
 - Transaction draft form for creation and updates
 - Validation of required fields before submit

### Persistence
The following state is persisted in `localStorage`:
 - transactions
 - role
 - search query
 - active filters
 - sort preference
 - theme preference

### Theming
 - Light and dark themes
 - Theme toggle in the top bar
 - Theme preference retained between sessions

## Technical Stack
 - React 19
 - Vite 8
 - Tailwind CSS v4
 - Recharts
 - React Router
 - Lucide React icons
 - ESLint

## Project Structure
Key source modules:
 - `src/pages/DashboardPage.jsx`: primary state orchestration and data derivation
 - `src/sections/OverviewSection.jsx`: summary and chart composition
 - `src/sections/InsightsSection.jsx`: insight cards
 - `src/sections/TransactionsSection.jsx`: filtering, actions, and transaction workflows
 - `src/components/TransactionTable.jsx`: desktop/mobile transaction rendering and inline edit UI
 - `src/components/BalanceTrendChart.jsx`: trend chart component
 - `src/components/SpendingDonut.jsx`: spending distribution chart component
 - `src/components/Sidebar.jsx`: navigation and goal panel

## Setup and Run

### Prerequisites
 - Node.js 18+
 - npm 9+

### Install
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Lint
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Design and Implementation Notes

### State Management Approach
State is managed with React hooks in `DashboardPage.jsx`, with memoized selectors for derived values (summary cards, insights, filtered transactions, date/category options). This keeps state predictable and minimizes redundant recalculation.

### Responsiveness Strategy
 - Sidebar behavior adjusts between fixed desktop/tablet and stacked mobile layout
 - Transaction data uses responsive patterns for desktop table and mobile-friendly card rendering
 - Controls and action bars collapse/stack at narrow widths

### Data and Formatting
 - Currency presentation uses INR formatting
 - Dates are normalized from timestamps for consistent sorting and filtering
 - CSV export follows escaped value formatting for compatibility

## Evaluation-Focused Summary
This implementation is designed to demonstrate:
 - practical feature completeness for a finance dashboard
 - disciplined component modularity
 - role-aware UI logic
 - responsive layout behavior
 - maintainable, production-oriented front-end structure

## Notes
 - Build may report a chunk-size warning from Vite due to charting/UI dependencies. This does not affect correctness and can be optimized further with code splitting if required.
