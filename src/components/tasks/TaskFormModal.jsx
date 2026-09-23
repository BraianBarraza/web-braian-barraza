import { useState } from "react";
import { TASK_STATUSES, TASK_TYPES, DEFAULT_STATUS, DEFAULT_TYPE } from "./taskConstants";
import { formatDuration, toDate } from "./taskUtils";

const toInputDate = (value) => {
    const date = toDate(value);
    if (!date) return "";
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const buildInitialForm = (task) => ({
    title: task?.title || "",
    description: task?.description || "",
    client: task?.client || "",
    type: task?.type || DEFAULT_TYPE,
    status: task?.status || DEFAULT_STATUS,
    receivedAt: toInputDate(task?.receivedAt) || toInputDate(new Date()),
    startedAt: toInputDate(task?.startedAt),
    completedAt: toInputDate(task?.completedAt),
    timeSpentMinutes: task?.timeSpentMinutes ?? 0,
});

const TaskFormModal = ({ task, clientOptions, onSave, onClose }) => {
    const [form, setForm] = useState(() => buildInitialForm(task));
    const [saving, setSaving] = useState(false);

    const updateField = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({
                title: form.title.trim(),
                description: form.description.trim(),
                client: form.client.trim(),
                type: form.type,
                status: form.status,
                receivedAt: form.receivedAt || null,
                startedAt: form.startedAt || null,
                completedAt: form.completedAt || null,
                timeSpentMinutes: Number(form.timeSpentMinutes) || 0,
            });
            onClose();
        } catch (err) {
            alert("Error saving task: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[10004] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
                <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 pb-4 pt-6 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {task ? "Editar tarea" : "Nueva tarea"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-white"
                        aria-label="Cerrar"
                    >
                        <i className="bx bx-x"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Título *
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={updateField("title")}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descripción
                        </label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={updateField("description")}
                            className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cliente *
                        </label>
                        <input
                            type="text"
                            required
                            list="task-client-options"
                            value={form.client}
                            onChange={updateField("client")}
                            placeholder="ewolves® Consulting"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <datalist id="task-client-options">
                            {clientOptions.map((client) => (
                                <option key={client} value={client} />
                            ))}
                        </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tipo
                            </label>
                            <select
                                value={form.type}
                                onChange={updateField("type")}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                {TASK_TYPES.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Estado
                            </label>
                            <select
                                value={form.status}
                                onChange={updateField("status")}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                {TASK_STATUSES.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <fieldset className="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                        <legend className="px-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Fechas
                        </legend>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Recibido
                                </label>
                                <input
                                    type="date"
                                    value={form.receivedAt}
                                    onChange={updateField("receivedAt")}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Inicio
                                </label>
                                <input
                                    type="date"
                                    value={form.startedAt}
                                    onChange={updateField("startedAt")}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Finalización
                                </label>
                                <input
                                    type="date"
                                    value={form.completedAt}
                                    onChange={updateField("completedAt")}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </fieldset>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tiempo invertido (minutos)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={form.timeSpentMinutes}
                            onChange={updateField("timeSpentMinutes")}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Equivale a {formatDuration(Number(form.timeSpentMinutes) || 0)}. También puedes usar el
                            cronómetro de la tarjeta.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <i className="bx bx-loader-alt bx-spin"></i>
                                    Guardando...
                                </>
                            ) : (
                                "Guardar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormModal;
