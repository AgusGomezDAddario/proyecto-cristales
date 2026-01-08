import { Head, useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { FormEventHandler } from 'react';
import { Concepto, MedioDePago, Movimiento } from '@/types/movimiento';

interface Props {
    movimiento: Movimiento;
    conceptos: Concepto[];
    mediosDePago: MedioDePago[];
    tipo: string;   // 'ingreso' o 'egreso'
    label: string;  // 'Ingreso' o 'Egreso'
}

export default function Edit({ movimiento, conceptos, mediosDePago, tipo, label }: Props) {
    const tipoPlural = tipo.endsWith("s") ? tipo : `${tipo}s`;

    const { data, setData, processing, errors, post } = useForm({
        fecha: movimiento.fecha.split("T")[0],
        monto: movimiento.monto,
        concepto_id: movimiento.concepto_id,
        medio_de_pago_id: movimiento.medio_de_pago_id,
        comprobantes: [] as File[],
        comprobantes_a_eliminar: [] as number[],
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(`/${tipoPlural}/${movimiento.id}`, {
            forceFormData: true,
            preserveScroll: true,
            data: {
                ...data,
                _method: 'put',
            },
        });
    };






    return (
        <DashboardLayout>
            <Head title={`Editar ${label}`} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg`}>
                            ✏️
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Editar {label}</h1>
                            <p className="text-gray-600 mt-1">Modifique los datos del movimiento</p>
                        </div>
                    </div>
                </div>

                {/* Card con formulario */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <form onSubmit={submit} className="space-y-6">

                        {/* Fecha */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Fecha *
                            </label>
                            <input
                                type="date"
                                value={data.fecha}
                                onChange={(e) => setData("fecha", e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl outline-none text-gray-900 font-medium transition ${errors.fecha ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                    }`}
                            />
                            {errors.fecha && <p className="mt-2 text-sm text-red-600">{errors.fecha}</p>}
                        </div>

                        {/* Monto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Monto *
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold text-lg">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.monto}
                                    onChange={(e) => setData("monto", e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-lg font-semibold text-gray-900 outline-none transition ${errors.monto ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                />
                            </div>
                            {errors.monto && <p className="mt-2 text-sm text-red-600">{errors.monto}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Concepto */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Concepto *
                                </label>
                                <select
                                    value={data.concepto_id}
                                    onChange={(e) => setData("concepto_id", e.target.value)}
                                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl outline-none text-gray-900 transition ${errors.concepto_id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {conceptos.map((concepto) => (
                                        <option key={concepto.id} value={concepto.id}>
                                            {concepto.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.concepto_id && <p className="mt-2 text-sm text-red-600">{errors.concepto_id}</p>}
                            </div>

                            {/* Medio de pago */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Medio de Pago
                                </label>
                                <select
                                    value={data.medio_de_pago_id ?? ""}
                                    onChange={(e) => setData("medio_de_pago_id", e.target.value)}
                                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl outline-none text-gray-900 transition ${errors.medio_de_pago_id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <option value="">Seleccione</option>
                                    {mediosDePago.map((medio) => (
                                        <option key={medio.id} value={medio.id}>
                                            {medio.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.medio_de_pago_id && <p className="mt-2 text-sm text-red-600">{errors.medio_de_pago_id}</p>}
                            </div>
                        </div>

                        {/* Comprobantes existentes */}
                        {/* Comprobantes existentes (los que ya estaban en la BD) */}
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Comprobantes existentes</h3>

                            {(movimiento.comprobantes ?? [])
                                .filter(c => !data.comprobantes_a_eliminar.includes(c.id))
                                .length === 0 ? (
                                <p className="text-gray-500 text-sm">No quedan comprobantes.</p>
                            ) : (
                                (movimiento.comprobantes ?? [])
                                    .filter(c => !data.comprobantes_a_eliminar.includes(c.id))
                                    .map((c: any) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center justify-between bg-gray-50 border px-4 py-2 mb-2 rounded-lg"
                                        >
                                            <span className="truncate max-w-[200px]">{c.ruta_archivo.split('/').pop()}</span>

                                            <div className="flex gap-3">
                                                <a
                                                    href={`/storage/${c.ruta_archivo}`}
                                                    target="_blank"
                                                    className="text-blue-600 text-sm"
                                                >
                                                    Ver
                                                </a>

                                                {/* Botón para marcar como eliminado */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData("comprobantes_a_eliminar", [
                                                            ...data.comprobantes_a_eliminar,
                                                            c.id
                                                        ])
                                                    }
                                                    className="text-red-600 text-sm font-bold"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>


                        {/* Nuevos comprobantes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Agregar nuevos comprobantes
                            </label>

                            <input
                                id="file-upload"
                                type="file"
                                name="comprobantes"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    if (!e.target.files) return;
                                    setData("comprobantes", [
                                        ...data.comprobantes,
                                        ...Array.from(e.target.files),
                                    ]);
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => document.getElementById("file-upload")?.click()}
                                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                            >
                                📎 Agregar comprobantes
                            </button>

                            <div className="mt-4 space-y-2">
                                {data.comprobantes.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 border px-4 py-2 rounded-xl"
                                    >
                                        <span>{file.name}</span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const copia = [...data.comprobantes];
                                                copia.splice(index, 1);
                                                setData("comprobantes", copia);
                                            }}
                                            className="text-red-600 hover:text-red-800 font-bold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {errors.comprobantes && <p className="text-sm text-red-600">{errors.comprobantes}</p>}

                            {Object.keys(errors)
                                .filter((k) => k.startsWith("comprobantes."))
                                .map((k) => (
                                    <p key={k} className="text-sm text-red-600">
                                        {errors[k]}
                                    </p>
                                ))}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg disabled:opacity-50"
                            >
                                Guardar cambios
                            </button>

                            <Link
                                href={`/${tipoPlural}`}
                                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
