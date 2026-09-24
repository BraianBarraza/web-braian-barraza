import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import TaskFormModal from "./TaskFormModal";
import { TASK_STATUSES, TASK_TYPES } from "./taskConstants";
import {
    filterTasks,
    formatDuration,
    formatShortDate,
    getClientOptions,
    getTypeMeta,
    groupTasksByStatus,
    sortByCompletedDesc,
} from "./taskUtils";

const TaskBoard = ({ tasks, loading, onCreate, onUpdate, onDelete, onMoveStatus, onStartTimer, onStopTimer }) => {
    const [clientFilter, setClientFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [view, setView] = useState("board");
    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverStatus, setDragOverStatus] = useState(null);

    const clientOptions = useMemo(() => getClientOptions(tasks), [tasks]);
    const filteredTasks = useMemo(
        () => filterTasks(tasks, { client: clientFilter, type: typeFilter }),
        [tasks, clientFilter, typeFilter]
    );
    const grouped = useMemo(() => groupTasksByStatus(filteredTasks), [filteredTasks]);
    const history = useMemo(
        () => sortByCompletedDesc(filteredTasks.filter((task) => task.status === "resolved")),
        [filteredTasks]
    );
    const totalHistoryMinutes = useMemo(
        () => history.reduce((sum, task) => sum + (task.timeSpentMinutes || 0), 0),
        [history]
    );

    const openCreate = () => {
        setEditingTask(null);
        setFormOpen(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingTask(null);
    };

    const handleSave = async (data) => {
        if (editingTask) {
            await onUpdate(editingTask.id, data);
        } else {
            await onCreate(data);
        }
    };

    const handleDelete = async (task) => {
        if (!window.confirm(`Delete "${task.title}"?`)) return;
        await onDelete(task);
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
        setDragOverStatus(null);
    };

    const handleDrop = async (statusId) => {
        if (draggedTask && draggedTask.status !== statusId) {
            await onMoveStatus(draggedTask, statusId);
        }
        setDraggedTask(null);
        setDragOverStatus(null);
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        aria-label="Filtrar por cliente"
                    >
                        <option value="all">Todos los clientes</option>
                        {clientOptions.map((client) => (
                            <option key={client} value={client}>
                                {client}
                            </option>
                        ))}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        aria-label="Filtrar por tipo"
                    >
                        <option value="all">Todos los tipos</option>
                        {TASK_TYPES.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    <div className="flex rounded-lg border border-gray-300 p-1 dark:border-gray-600">
                        <button
                            type="button"
                            onClick={() => setView("board")}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                view === "board"
                                    ? "bg-primary text-white"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            }`}
                        >
                            Tablero
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("history")}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                view === "history"
                                    ? "bg-primary text-white"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            }`}
                        >
                            Historial
                        </button>
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary/90"
                >
                    <i className="bx bx-plus"></i>
                    Nueva tarea
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <i className="bx bx-loader-alt bx-spin text-4xl text-primary"></i>
                </div>
            ) : view === "board" ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {TASK_STATUSES.map((status) => {
                        const columnTasks = grouped[status.id] || [];
                        return (
                            <div
                                key={status.id}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverStatus(status.id);
                                }}
                                onDragLeave={() => setDragOverStatus((current) => (current === status.id ? null : current))}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleDrop(status.id);
                                }}
                                className={`rounded-xl border-t-4 bg-gray-50 p-3 transition-colors dark:bg-gray-900/50 ${status.accent} ${
                                    dragOverStatus === status.id ? "ring-2 ring-primary" : ""
                                }`}
                            >
                                <div className="mb-3 flex items-center justify-between px-1">
                                    <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                                        <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`}></span>
                                        {status.label}
                                    </h3>
                                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        {columnTasks.length}
                                    </span>
                                </div>
                                <div className="min-h-[80px] space-y-3">
                                    {columnTasks.length === 0 ? (
                                        <p className="px-1 py-6 text-center text-sm text-gray-400 dark:text-gray-600">
                                            Sin tareas
                                        </p>
                                    ) : (
                                        columnTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onDragStart={handleDragStart}
                                                onDragEnd={handleDragEnd}
                                                onEdit={openEdit}
                                                onDelete={handleDelete}
                                                onMoveStatus={onMoveStatus}
                                                onStartTimer={onStartTimer}
                                                onStopTimer={onStopTimer}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                        <span>{history.length} tareas resueltas</span>
                        <span>Tiempo total: {formatDuration(totalHistoryMinutes)}</span>
                    </div>
                    {history.length === 0 ? (
                        <p className="px-4 py-10 text-center text-gray-400 dark:text-gray-600">
                            Aún no hay tareas resueltas.
                        </p>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {history.map((task) => {
                                const typeMeta = getTypeMeta(task.type);
                                return (
                                    <button
                                        key={task.id}
                                        onClick={() => openEdit(task)}
                                        className="flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${typeMeta.badge}`}>
                                                <i className={`bx ${typeMeta.icon}`}></i>
                                                {typeMeta.label}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{task.client}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Finalizado: {formatShortDate(task.completedAt)}</span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {formatDuration(task.timeSpentMinutes)}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {formOpen && (
                <TaskFormModal
                    task={editingTask}
                    clientOptions={clientOptions}
                    onSave={handleSave}
                    onClose={closeForm}
                />
            )}
        </div>
    );
};

export default TaskBoard;
