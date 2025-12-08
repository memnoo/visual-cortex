import Button from "@/app/components/atoms/Button";
import { ICON_NAME } from "@/app/components/atoms/Icon";
import Link from "next/link";

type BreadcrumbButtonProps = {
  path: string;
  label: string;
  icon?: ICON_NAME;
};

export const BreadcrumbButton = ({
  path,
  label,
  icon = ICON_NAME.CHEVRON_LEFT,
}: BreadcrumbButtonProps) => (
  <Link href={path}>
    <Button type="button" variant="transparent" iconName={icon}>
      {label}
    </Button>
  </Link>
);
