"use client";

import { useRouter } from "next/navigation";
import { BreadcrumbButton } from "../components/BreadcrumbButton";
import { Deck } from "../decks/components/Deck";
import { useDecksWithCount } from "../hooks/useDecks";

export default function ReviewSessionPage() {
  const router = useRouter();
  const { data = [] } = useDecksWithCount();

  return (
    <section className="flex flex-col gap-2 content-stretch">
      <BreadcrumbButton path="/dashboard" label="Dashboard" />

      <h2 className="text-xl text-center font-bold my-2">
        Which deck would you like to review?
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {data.map((d) => (
          <Deck
            key={d.uuid}
            deck={d}
            onClick={() => router.push(`/review-session/${d.uuid}`)}
          />
        ))}
      </div>
    </section>
  );
}
