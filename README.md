# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

To get your dashboard running with the charts and the AI assistant, follow these steps. I've organized this for a standard **Vite + React + Tailwind** environment.

## 🛠️ Installation & Setup

### 1. Install Dependencies

Run the following command in your terminal to install the charting library and ensure Tailwind is ready:

```bash
npm install

```

### 2. Data Placement

Ensure your data file is in the `public` folder so the application can fetch it at runtime:

- **Path:** `public/db.dashboard_incidents.json`

### 3. Project Structure

Your main files should look like this:

- `src/App.jsx`: Main dashboard logic and Recharts grid.

## 🚀 Running the App

1. **Start the development server:**

```bash
npm run dev

```

2. **Build the production files:**

```bash
npm run build

```

> ### Data Analysis Dashboard
>
> **Tech Stack:** React, Tailwind CSS, Recharts, Cloudflare Workers AI.
> **How it works:**
>
> **Visuals:** Uses `recharts` to render a 5-chart grid (Bar, Area, Pie, Composed, Scatter).
