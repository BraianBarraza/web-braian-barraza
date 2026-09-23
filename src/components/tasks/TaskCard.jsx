import { useEffect, useState } from "react";
import { TASK_STATUSES } from "./taskConstants";
import {
    formatDuration,
    formatShortDate,
    getTypeMeta,
    computeLiveTimeSpent,
} from "./taskUtils";

const TaskCard = ({
    task,
    onDragStart,
    onDragEnd,
    onEdit,
    onDelete,
    onMoveStatus,
    onStartTimer,
    onStopTimer,
}) => {
    const typeMeta = getTypeMeta(task.type);
    const isTimerRunning = Boolean(task.timerStartedAt);
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        if (!isTimerRunning) return undefined;
        const interval = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const liveMinutes = computeLiveTimeSpent(task, now);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onDragEnd={onDragEnd}
            className="cursor-grab space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing dark:border-gray-800 dark:bg-gray-900"
        >
            <div className="flex items-start justify-between gap-2">
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${typeMeta.badge}`}
                >
                    <i className={`bx ${typeMeta.icon}`}></i>
                    {typeMeta.label}
                </span>
                <span className="truncate rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {task.client}
                </span>
            </div>

            <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                {task.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                        {task.description}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-3 gap-1 text-center text-[11px] text-gray-500 dark:text-gray-400">
                <div>
                    <p className="font-medium text-gray-400 dark:text-gray-500">Recibido</p>
                    <p>{formatShortDate(task.receivedAt)}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-400 dark:text-gray-500">Inicio</p>
                    <p>{formatShortDate(task.startedAt)}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-400 dark:text-gray-500">Fin</p>
                    <p>{formatShortDate(task.completedAt)}</p>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <i className="bx bx-stopwatch text-primary"></i>
                    {formatDuration(liveMinutes)}
                    {isTimerRunning && (
                        <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => (isTimerRunning ? onStopTimer(task) : onStartTimer(task))}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isTimerRunning
                            ? "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                    aria-label={isTimerRunning ? "Pausar cronómetro" : "Iniciar cronómetro"}
                >
                    <i className={`bx ${isTimerRunning ? "bx-pause" : "bx-play"}`}></i>
                </button>
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={task.status}
                    onChange={(e) => onMoveStatus(task, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    aria-label="Mover tarea a otro estado"
                >
                    {TASK_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.label}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                    aria-label="Editar tarea"
                >
                    <i className="bx bx-edit-alt"></i>
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(task)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                    aria-label="Eliminar tarea"
                >
                    <i className="bx bx-trash"></i>
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
