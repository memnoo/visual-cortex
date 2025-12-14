import Button from "@/app/components/atoms/Button";
import type { IconName } from "@/app/components/atoms/Icon";
import Link from "next/link";

type BreadcrumbButtonProps = {
  path: string;
  label: string;
  icon?: IconName;
};

export const BreadcrumbButton = ({
  path,
  label,
  icon = "chevron_left",
}: BreadcrumbButtonProps) => (
  <Link href={path}>
    <Button type="button" variant="transparent" iconName={icon}>
      {label}
    </Button>
  </Link>
);
