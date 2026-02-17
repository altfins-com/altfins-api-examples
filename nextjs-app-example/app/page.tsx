'use client';

import { AltfinsControls } from '@/lib/components/altfins-controls';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Altfins API Explorer
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Explore cryptocurrency market data, screener results, and trading signals using the Altfins API.
          </p>
        </header>

        <main>
          <AltfinsControls />
        </main>
      </div>
    </div>
  );
}
