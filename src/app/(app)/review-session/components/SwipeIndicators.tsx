import { useTranslations } from "next-intl";
import classNames from "classnames";

export const SwipeIndicators = ({
  dragOffset,
}: {
  dragOffset: { x: number; y: number };
}) => {
  const t = useTranslations();

  const rightOpacity = Math.min(Math.max(dragOffset.x / 100, 0), 1);
  const leftOpacity = Math.min(Math.max(-dragOffset.x / 100, 0), 1);
  const upOpacity = Math.min(Math.max(-dragOffset.y / 100, 0), 1);
  const downOpacity = Math.min(Math.max(dragOffset.y / 100, 0), 1);

  const baseClass =
    "absolute left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-xl font-bold pointer-events-none";

  return (
    <>
      <div
        className={classNames(
          baseClass,
          "translate-y-8 bg-green-500 text-2xl rotate-12"
        )}
        style={{ opacity: rightOpacity }}
      >
        {t("reviews.session.swipe.indicators.learnt")}
      </div>

      <div
        className={classNames(
          baseClass,
          "translate-y-8 bg-red-500 text-2xl -rotate-12"
        )}
        style={{ opacity: leftOpacity }}
      >
        {t("reviews.session.swipe.indicators.dunno")}
      </div>

      <div
        className={classNames(baseClass, "-top-16 bg-yellow-500 text-xl")}
        style={{ opacity: upOpacity }}
      >
        {t("reviews.session.swipe.indicators.hint")}
      </div>

      <div
        className={classNames(baseClass, "translate-y-6 bg-gray-500 text-xl")}
        style={{ opacity: downOpacity }}
      >
        {t("reviews.session.swipe.indicators.pass")}
      </div>
    </>
  );
};
