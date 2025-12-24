import { useTranslations } from "next-intl";
import classNames from "classnames";

import { ReviewSessionStats } from "../../types";

import { Button } from "@/app/components/atoms/Button";
import { StatProgressBar } from "./StatProgressBar";

type StatsPanelProps = {
  remainingCount: number;
  stats: ReviewSessionStats;
  onRestartClicked: () => void;
};

export const StatsPanel = ({
  remainingCount,
  stats,
  onRestartClicked,
}: StatsPanelProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col content-stretch bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-2 flex items-center">
        <div className="flex items-center justify-between gap-6 w-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {remainingCount}
            </div>
            <div className="text-xs text-gray-600">
              {t("reviews.session.remaining")}
            </div>
          </div>
          <div className="flex flex-col content-stretch text-left">
            <p
              className={classNames("text-sm text-gray-600", {
                "font-bold text-green-700": stats.correct > 0,
              })}
            >
              {t("reviews.session.stats.correct", { count: stats.correct })}
            </p>
            <p
              className={classNames("text-sm text-gray-600", {
                "font-bold text-red-800": stats.incorrect > 0,
              })}
            >
              {t("reviews.session.stats.incorrect", { count: stats.incorrect })}
            </p>
            <p
              className={classNames("text-sm text-gray-600", {
                "font-bold text-yellow-600": stats.hintUsed > 0,
              })}
            >
              {t("reviews.session.stats.hintsUsed", { count: stats.hintUsed })}
            </p>
          </div>
          {/* TOFIX Make it a special Button component */}
          <div className="text-center">
            <Button
              variant="ghost"
              iconName="back"
              onClick={onRestartClicked}
            />
            <div className="text-xs text-gray-600">
              {t("reviews.session.restart")}
            </div>
          </div>
        </div>
      </div>
      <StatProgressBar
        correct={stats.correct}
        incorrect={stats.incorrect}
        hintUsed={stats.hintUsed}
        remaining={remainingCount}
      />
    </div>
  );
};
