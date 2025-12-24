import { useTranslations } from "next-intl";
import Link from "next/link";

export const PlaceholderStateReview = ({ label }: { label: string }) => {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-700 mb-4">{label}</p>
        <Link
          href="/review-session"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {t("reviews.placeholderState.linkText")}
        </Link>
      </div>
    </div>
  );
};
