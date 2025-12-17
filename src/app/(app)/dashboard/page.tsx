"use client";

import Link from "next/link";
import Button from "@/app/components/atoms/Button";

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-2 content-stretch w-full">
      <Link href="/decks">
        <Button
          type="button"
          variant="transparent"
          iconName="chevron_right"
          iconPosition="right"
          className="w-full h-full text-left"
        >
          Go to decks
        </Button>
      </Link>
      <Link href="/review-session">
        <Button
          type="button"
          variant="transparent"
          iconName="chevron_right"
          iconPosition="right"
          className="w-full h-full text-left"
        >
          Review decks
        </Button>
      </Link>
    </section>
  );
}
