import { TASK_STATUSES, TASK_TYPES } from "./taskConstants";

/**
 * Normalizes a Firestore Timestamp, JS Date, epoch number or null into a Date.
 */
export const toDate = (value) => {
    if (value === null || value === undefined || value === "") return null;
    if (value instanceof Date) return value;
    if (typeof value.toDate === "function") return value.toDate();
    if (typeof value === "number") return new Date(value);
    return null;
};

export const getStatusMeta = (statusId) =>
    TASK_STATUSES.find((status) => status.id === statusId) || TASK_STATUSES[0];

export const getTypeMeta = (typeId) =>
    TASK_TYPES.find((type) => type.id === typeId) || TASK_TYPES[0];

export const groupTasksByStatus = (tasks) => {
    const groups = { pending: [], in_progress: [], resolved: [] };
    tasks.forEach((task) => {
        const key = groups[task.status] ? task.status : "pending";
        groups[key].push(task);
    });
    return groups;
};

export const filterTasks = (tasks, { client, type } = {}) =>
    tasks.filter((task) => {
        if (client && client !== "all" && task.client !== client) return false;
        if (type && type !== "all" && task.type !== type) return false;
        return true;
    });

export const getClientOptions = (tasks) => {
    const unique = new Set(tasks.map((task) => task.client).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
};

/**
 * Formats a minute count as a short human string, e.g. "2h 15m", "45m", "0m".
 */
export const formatDuration = (minutes) => {
    const total = Math.max(0, Math.round(minutes || 0));
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

export const computeElapsedMinutes = (timerStartedAt, now = new Date()) => {
    const start = toDate(timerStartedAt);
    if (!start) return 0;
    const diffMs = now.getTime() - start.getTime();
    return Math.max(0, diffMs / 60000);
};

/**
 * Time spent so far, including the live elapsed portion of a running timer.
 */
export const computeLiveTimeSpent = (task, now = new Date()) => {
    const base = task.timeSpentMinutes || 0;
    if (!task.timerStartedAt) return base;
    return base + computeElapsedMinutes(task.timerStartedAt, now);
};

/**
 * Side effects of moving a task to `newStatus`: first entry into "in_progress"
 * stamps startedAt, entering "resolved" stamps completedAt and stops any
 * running timer, and leaving "resolved" clears completedAt again.
 */
export const applyStatusTransition = (task, newStatus, now = new Date()) => {
    if (newStatus === task.status) return {};
    const patch = { status: newStatus };

    if (newStatus === "in_progress" && !task.startedAt) {
        patch.startedAt = now;
    }

    if (newStatus === "resolved") {
        patch.completedAt = task.completedAt || now;
        if (task.timerStartedAt) {
            patch.timeSpentMinutes = computeLiveTimeSpent(task, now);
            patch.timerStartedAt = null;
        }
    } else if (task.status === "resolved") {
        patch.completedAt = null;
    }

    return patch;
};

export const formatShortDate = (value) => {
    const date = toDate(value);
    if (!date) return "—";
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
};

export const sortByReceivedDesc = (tasks) =>
    [...tasks].sort((a, b) => {
        const dateA = toDate(a.receivedAt)?.getTime() || 0;
        const dateB = toDate(b.receivedAt)?.getTime() || 0;
        return dateB - dateA;
    });

export const sortByCompletedDesc = (tasks) =>
    [...tasks].sort((a, b) => {
        const dateA = toDate(a.completedAt)?.getTime() || 0;
        const dateB = toDate(b.completedAt)?.getTime() || 0;
        return dateB - dateA;
    });
