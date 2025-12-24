"use client";

import { useRouter } from "next/navigation";
import { BreadcrumbButton } from "../components/BreadcrumbButton";
import { Deck } from "../decks/components/Deck";
import { useDecksWithCount } from "../hooks/useDecks";
import { useTranslations } from "next-intl";

export default function ReviewSessionPage() {
  const t = useTranslations();
  const router = useRouter();
  const { data = [] } = useDecksWithCount();

  return (
    <section className="flex flex-col gap-3 content-stretch">
      <BreadcrumbButton path="/dashboard" label="Dashboard" />

      <h2 className="text-xl text-center font-bold">{t("reviews.header")}</h2>

      <div className="grid grid-cols-2 gap-3 auto-rows-fr">
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
