import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Ban, AlertTriangle } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    ordenId: number;
};

export default function ConfirmAnularModal({ open, onClose, onConfirm, ordenId }: Props) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-7 w-7 text-red-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">
                        ¿Anular Orden #{ordenId}?
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600 mt-2">
                        Esta acción no se puede deshacer. Si la orden ya generó ingresos en caja,
                        se crearán <strong className="text-gray-900">movimientos de reversa</strong> (egresos)
                        para compensar automáticamente.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 flex gap-3 sm:justify-center">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 shadow-md"
                    >
                        <Ban className="w-4 h-4" />
                        Sí, anular
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
