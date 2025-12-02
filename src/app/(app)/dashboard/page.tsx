"use client";

import Link from "next/link";
import Button from "@/app/components/atoms/Button";
import { ICON_NAME } from "@/app/components/atoms/Icon";

export default function DashboardPage() {
  return (
    <section className="max-w-8xl mx-auto p-2">
      <Link href="/decks">
        <Button
          type="button"
          variant="transparent"
          iconName={ICON_NAME.CHEVRON_RIGHT}
          iconPosition="right"
          className="w-full h-full text-left"
        >
          Voir mes decks
        </Button>
      </Link>
    </section>
  );
}
