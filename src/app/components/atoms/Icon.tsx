import { BackIcon } from "./icons/BackIcon";
import { CheckedIcon } from "./icons/CheckedIcon";
import { ChevronLeftIcon } from "./icons/ChevronLeftIcon";
import { ChevronRightIcon } from "./icons/ChevronRightIcon";
import { CrossIcon } from "./icons/CrossIcon";
import { DeleteIcon } from "./icons/DeleteIcon";
import { EditIcon } from "./icons/EditIcon";
import { FileIcon } from "./icons/FileIcon";
import { LogoutIcon } from "./icons/LogoutIcon";
import { MenuIcon } from "./icons/MenuIcon";
import { PlusIcon } from "./icons/PlusIcon";

export const icons = {
  file: FileIcon,
  menu: MenuIcon,
  checked: CheckedIcon,
  chevron_left: ChevronLeftIcon,
  chevron_right: ChevronRightIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  back: BackIcon,
  plus: PlusIcon,
  cross: CrossIcon,
  logout: LogoutIcon,
};

export type IconName =
  | "back"
  | "checked"
  | "chevron_left"
  | "chevron_right"
  | "cross"
  | "delete"
  | "edit"
  | "file"
  | "logout"
  | "menu"
  | "plus";

export const Icon = ({ name }: { name: IconName }) => {
  const IconComponent = icons[name];
  return IconComponent ? <IconComponent /> : null;
};
