import { Trash2 } from "lucide-react";

type Props = {
  onClick: () => void;
  title?: string;
  disabled?: boolean;
  size?: "xl";
  buttonClasses?: string;
  trashClasses?: string;
};

export default function DeleteButton({
  onClick,
  title = "Eliminar",
  disabled = false,
  size,
  buttonClasses = size === "xl" ? "h-11 w-11 flex items-center justify-center" : "",
  trashClasses = size === "xl" ? "h-5 w-5" : "h-4 w-4",
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2
        bg-red-500
        hover:bg-red-600
        text-white
        rounded-lg
        transition
        shadow-sm
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${buttonClasses}
        `}
    >
      <Trash2 className={trashClasses} />
    </button>
  );
}
