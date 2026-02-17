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

- Node.js (version 18 or higher recommended)
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

1. Create a `.env.local` file in the root directory.
2. Add your Altfins API key to the file:
   ```env
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

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
- `lib/services/`: API service logic and helper functions.
- `lib/components/`: Reusable UI components.
- `lib/hooks/`: Custom React hooks for data fetching.
