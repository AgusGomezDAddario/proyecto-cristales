import { Pencil } from "lucide-react";

type Props = {
    onClick: () => void;
    title?: string;
    disabled?: boolean;
    size?: "xl";
    buttonClasses?: string;
    pencilClasses?: string;
};

export default function EditButton({
    onClick,
    title = "Editar",
    disabled = false,
    size,
    buttonClasses = size === "xl" ? "h-11 w-11 flex items-center justify-center" : "",
    pencilClasses = size === "xl" ? "h-5 w-5" : "h-4 w-4",
}: Props) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                p-2
                bg-slate-500
                hover:bg-slate-600
                text-white
                rounded-lg
                transition
                shadow-sm
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${buttonClasses}
            `}
        >
            <Pencil className={pencilClasses} />
        </button>
    );
}
