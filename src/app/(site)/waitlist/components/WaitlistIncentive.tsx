import { useTranslations } from "next-intl";

import { Icon } from "@/app/components/atoms/Icon";
import { BrandName } from "@/app/components/BrandName";

export const WaitlistIncentive = () => {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-bold text-gray-900 leading-tight">
        {t("site.waitlist.incentive.title.join")}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          {t("site.waitlist.incentive.title.learning")}
        </span>
        <br />
        {t("site.waitlist.incentive.title.revolution")}
      </h1>

      <p className="text-xl text-gray-600 leading-relaxed">
        {t.rich("site.waitlist.incentive.subtitle", {
          brandName: () => <BrandName />,
        })}
      </p>

      <div className="space-y-4 pt-4">
        <div className="flex items-start gap-3">
          <CircledCheckIcon />
          <div>
            <h3 className="font-semibold text-gray-900">
              {t("site.waitlist.incentive.features.customizedAi.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("site.waitlist.incentive.features.customizedAi.description")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CircledCheckIcon />
          <div>
            <h3 className="font-semibold text-gray-900">
              {t("site.waitlist.incentive.features.multiDomains.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("site.waitlist.incentive.features.multiDomains.description")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CircledCheckIcon />
          <div>
            <h3 className="font-semibold text-gray-900">
              {t("site.waitlist.incentive.features.smartAlgorithm.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("site.waitlist.incentive.features.smartAlgorithm.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CircledCheckIcon = () => (
  <div className="mt-1 flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
    <Icon name="check" extraClasses="text-green-600" />
  </div>
);
