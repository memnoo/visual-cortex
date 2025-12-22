"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/app/components/atoms/Button";

export default function DashboardPage() {
  const t = useTranslations();

  const links = [
    { path: "/decks", label: t("nav.decks") },
    { path: "/review-session", label: t("nav.review-session") },
  ];

  return (
    <section className="flex flex-col gap-2 content-stretch w-full">
      {links.map(({ path, label }, index) => (
        <Link key={index} href={path}>
          <Button
            type="button"
            variant="transparent"
            iconName="chevron_right"
            iconPosition="right"
            className="w-full h-full text-left"
          >
            {label}
          </Button>
        </Link>
      ))}
    </section>
  );
}
