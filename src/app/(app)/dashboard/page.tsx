"use client";

import { useDecks } from "../hooks/useDecks";
import DecksManagement from "./components/DecksManagement";

export default function DashboardPage() {
  const { data: decks, isLoading } = useDecks();

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your decks...</p>
        </div>
      </div>
    );
  }

  return !decks || decks.length === 0 ? (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">No data available</p>
      </div>
    </div>
  ) : (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <DecksManagement decks={decks} />
    </section>
  );
}
