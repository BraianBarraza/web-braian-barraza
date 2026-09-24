// Enum values persisted in Firestore. Keep in sync with DOCS.md.
export const TASK_STATUSES = [
    {
        id: "pending",
        label: "Pendiente",
        icon: "bx-time-five",
        accent: "border-t-amber-400",
        dot: "bg-amber-400",
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
        id: "in_progress",
        label: "En proceso",
        icon: "bx-run",
        accent: "border-t-primary",
        dot: "bg-primary",
        badge: "bg-primary/10 text-primary",
    },
    {
        id: "resolved",
        label: "Resuelto",
        icon: "bx-check-circle",
        accent: "border-t-emerald-500",
        dot: "bg-emerald-500",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
];

export const TASK_TYPES = [
    {
        id: "bug",
        label: "Bug",
        icon: "bx-bug",
        badge: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
        id: "feature",
        label: "Feature",
        icon: "bx-bulb",
        badge: "bg-primary/10 text-primary",
    },
    {
        id: "chore",
        label: "Chore",
        icon: "bx-wrench",
        badge: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    },
    {
        id: "organizational",
        label: "Organizativo",
        icon: "bx-folder",
        badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
];

export const DEFAULT_STATUS = "pending";
export const DEFAULT_TYPE = "feature";

export const TASK_STATUS_IDS = TASK_STATUSES.map((status) => status.id);
export const TASK_TYPE_IDS = TASK_TYPES.map((type) => type.id);
