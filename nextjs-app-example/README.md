# Altfins API Example App

This is a Next.js application that demonstrates how to interact with the Altfins API. It provides a user interface to search for cryptocurrency signals and screener data.

The application features a **modern and clean design** with an intuitive interface. It uses **styled buttons** for easy access to predefined screener presets and presents the search results in a **well-organized, responsive table**.

## Features

- **Screener Presets:** predefined scans for popular technical setups (e.g., Strong Uptrend, Golden Cross, RSI Oversold).
- **Signal Search:** search for specific trading signals (e.g., Bullish/Bearish) for a given asset.
- **Data Visualization:** results are displayed in a responsive table with key metrics like price, market cap, and trend indicators.
- **Pagination:** support for navigating through large result sets.

## Getting Started

Follow these steps to run the application locally.

### Prerequisites

- Node.js 20.9 or higher
- `npm` or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

From `nextjs-app-example`, copy the template and set `ALTFINS_API_KEY` in the ignored local file, or inject it into the server process through your secret manager.

```bash
cp .env.example .env.local
```

Existing installations should rename `NEXT_PUBLIC_API_KEY` to `ALTFINS_API_KEY`, then rebuild and restart. Rotate the old key if it appeared in a commit, a browser build or request logs.

The example binds to loopback. Its API route uses the operator’s quota. Protect both the UI and `/api/altfins` with authentication before hosting it for other people.

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `app/`: Next.js app directory containing pages and API routes.
- [API route](app/api/altfins/route.ts) and [server service](lib/services/altfins.ts) for authenticated requests.
- `lib/components/`: Reusable UI components.
- `lib/hooks/`: Custom React hooks for data fetching.
