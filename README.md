# ClothesCash

> Status: archived prototype, superseded by [resale-monitor](https://github.com/wychorak/resale-monitor).

ClothesCash is a React dashboard for tracking clothing inventory, purchase costs, sales and resale profit. It was an early product experiment that informed the newer resale-monitor project.

## What it demonstrates

- CRUD flows for clothing inventory stored in Firestore
- sales, cost and profit summaries
- filtering and product-library management
- responsive dashboard UI built with React, TypeScript and Tailwind CSS

## Stack

React 19, TypeScript, Vite, Tailwind CSS, Firebase/Firestore, Recharts and Motion.

## Run locally

```bash
npm ci
npm run dev
```

The Firebase client configuration is included for the original prototype. The checked-in Firestore rules allow public access and must **not** be deployed with real or sensitive data. Use a separate Firebase project and restrictive rules for any further development.

## Verification

`npm run lint` and `npm run build` pass on the archived source. The generated bundle is large and would benefit from code splitting before production use.
