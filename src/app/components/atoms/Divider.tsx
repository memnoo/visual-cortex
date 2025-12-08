type DividerProps = {
  horizontal?: boolean;
  vertical?: boolean;
};

export const Divider = ({
  horizontal = true,
  vertical = false,
}: DividerProps) => {
  if (vertical) {
    return <div className="h-full mx-2 border-[1px]" />;
  }

  return horizontal && <hr className="w-full my-2" />;
};
