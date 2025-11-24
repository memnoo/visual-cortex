"use client";

import { Loader } from "@/app/components/atoms/Loader";
import DecksManagement from "./components/DecksManagement";
import { useDecksWithCount } from "../hooks/useDeckNew";

export default function DashboardPage() {
  const { data: decks, isLoading } = useDecksWithCount();

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <Loader text="Chargement de vos decks..." hasAccentColor />
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
    <section className="max-w-8xl mx-auto p-2">
      <DecksManagement decks={decks} />
    </section>
  );
}
