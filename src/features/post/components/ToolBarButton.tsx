type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export const ToolbarButton = ({
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
        "border border-gray-200 bg-white",
        "hover:bg-gray-100",
        "disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-blue-500 text-white border-blue-500 hover:bg-blue-600",
      ].join(" ")}
    >
      {children}
    </button>
  );
};
