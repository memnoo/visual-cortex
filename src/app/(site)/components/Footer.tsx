"use client";

import { createClient } from "@/lib/database/client";

export default function Footer() {
  const supabase = createClient();

  // const usersCount = supabase
  //   .from("Waitlist")
  //   .select("email", { count: "exact", head: true })
  //   .then((res) => res.count ?? 0);

  // const topicsCount = supabase
  //   .from("Deck")
  //   .select("topic", { count: "exact", head: true })
  //   .then((res) => res.count ?? 0);

  // const cardsCount = supabase
  //   .from("Card")
  //   .select("uuid", { count: "exact", head: true })
  //   .then((res) => res.count ?? 0);

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-indigo-600">{1}</p>
            <p className="text-sm text-gray-600">Inscrits</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">{3}</p>
            <p className="text-sm text-gray-600">Domaines</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-pink-600">{31}</p>
            <p className="text-sm text-gray-600">Cartes générées</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
