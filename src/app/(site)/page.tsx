"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useUser } from "../(app)/hooks/useUser";
import { Card } from "../components/atoms/Card";
import { Button } from "../components/atoms/Button";

export default function HomePage() {
  const t = useTranslations();
  const user = useUser();

  const blockContents = [
    {
      icon: "🧠",
      title: t("site.homepage.features.customisedAi.title"),
      description: t("site.homepage.features.customisedAi.description"),
    },
    {
      icon: "📊",
      title: t("site.homepage.features.smartFollowup.title"),
      description: t("site.homepage.features.smartFollowup.description"),
    },
    {
      icon: "🌍",
      title: t("site.homepage.features.multiDomains.title"),
      description: t("site.homepage.features.multiDomains.description"),
    },
  ];

  return (
    <div className="max-w-4xl w-full text-center space-y-8">
      <div className="space-y-4">
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          {t("site.homepage.subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {blockContents.map((content, index) => (
          <Card
            key={`block-content-${index}`}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="text-4xl mb-4">{content.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
        {user ? (
          <Button href="/dashboard" variant="primary">
            {t("site.homepage.cta.goToDecks")}
          </Button>
        ) : (
          <>
            <Button href="/login" variant="secondary">
              {t("site.homepage.cta.login")}
            </Button>
            <Button href="/waitlist" variant="link">
              {t("site.homepage.cta.joinWaitlist")}
            </Button>
          </>
        )}

        <Button href="/about" variant="link">
          {t("site.homepage.cta.learnMore")}
        </Button>
      </div>
    </div>
  );
}
