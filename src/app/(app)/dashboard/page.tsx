"use client";

import Link from "next/link";
import Button from "@/app/components/atoms/Button";

export default function DashboardPage() {
  return (
    <section className="max-w-8xl mx-auto p-2 flex flex-col gap-2 content-stretch">
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
    </section>
  );
}
