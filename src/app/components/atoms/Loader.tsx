type LoaderProps = {
  fit?: "content" | "parent";
  size?: "xsmall" | "small" | "medium" | "large";
  text?: string;
  hasAccentColor?: boolean;
};

export const Loader = ({
  fit = "parent",
  text,
  size = "medium",
  hasAccentColor = false,
}: LoaderProps) => {
  const TW_SIZES = {
    xsmall: 4,
    small: 6,
    medium: 12,
    large: 20,
  };

  return (
    <div
      className={`flex flex-col gap-4 ${
        fit === "parent" && "w-full"
      } content-stretch items-center space-around`}
    >
      <svg
        className={`animate-spin -ml-1 mr-2 h-${TW_SIZES[size]} w-${TW_SIZES[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className={hasAccentColor ? "fill-[#7C3AED]" : ""}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && (
        <p
          className={`${
            hasAccentColor ? "text-[#7C3AED]" : "text-gray-600"
          } font-bold"`}
        >
          {text}
        </p>
      )}
    </div>
  );
};
