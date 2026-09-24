// Local-only preview harness for the Kanban board, using mock data instead
// of Firestore (no Firebase credentials are available in this environment).
// Not part of the production build: it is a separate Vite entry point that
// index.html/App.jsx never reference, so `vite build` ignores it.
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import TaskBoard from "./components/tasks/TaskBoard";
import { applyStatusTransition, computeLiveTimeSpent } from "./components/tasks/taskUtils";
import "./input.css";

let nextId = 100;

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const initialTasks = [
    {
        id: "1",
        title: "El formulario de contacto no envía el email",
        description: "Al hacer submit el botón queda cargando indefinidamente en Safari.",
        client: "ewolves® Consulting",
        type: "bug",
        status: "pending",
        receivedAt: daysAgo(1),
        startedAt: null,
        completedAt: null,
        timeSpentMinutes: 0,
        timerStartedAt: null,
    },
    {
        id: "2",
        title: "Agregar modo oscuro al dashboard",
        description: "El cliente pidió que el dashboard respete el theme del sistema operativo.",
        client: "ewolves® Consulting",
        type: "feature",
        status: "in_progress",
        receivedAt: daysAgo(4),
        startedAt: daysAgo(2),
        completedAt: null,
        timeSpentMinutes: 95,
        timerStartedAt: null,
    },
    {
        id: "3",
        title: "Actualizar dependencias de seguridad",
        description: "npm audit reporta 3 vulnerabilidades altas en el backend.",
        client: "Nova Studio",
        type: "chore",
        status: "in_progress",
        receivedAt: daysAgo(6),
        startedAt: daysAgo(1),
        completedAt: null,
        timeSpentMinutes: 20,
        timerStartedAt: new Date(),
    },
    {
        id: "4",
        title: "Reunión de kickoff y alcance del proyecto",
        description: "Definir stack, entregables y cronograma con el cliente.",
        client: "Nova Studio",
        type: "organizational",
        status: "resolved",
        receivedAt: daysAgo(12),
        startedAt: daysAgo(12),
        completedAt: daysAgo(11),
        timeSpentMinutes: 60,
        timerStartedAt: null,
    },
    {
        id: "5",
        title: "Optimizar carga de imágenes en la landing",
        description: "Lazy loading + WebP para mejorar el LCP.",
        client: "ewolves® Consulting",
        type: "feature",
        status: "resolved",
        receivedAt: daysAgo(9),
        startedAt: daysAgo(8),
        completedAt: daysAgo(7),
        timeSpentMinutes: 180,
        timerStartedAt: null,
    },
    {
        id: "6",
        title: "Botón de checkout desalineado en mobile",
        description: "",
        client: "Nova Studio",
        type: "bug",
        status: "pending",
        receivedAt: daysAgo(0),
        startedAt: null,
        completedAt: null,
        timeSpentMinutes: 0,
        timerStartedAt: null,
    },
];

const KanbanPreview = () => {
    const [tasks, setTasks] = useState(initialTasks);

    const onCreate = async (data) => {
        const now = new Date();
        setTasks((current) => [
            {
                id: String(nextId++),
                ...data,
                receivedAt: data.receivedAt ? new Date(data.receivedAt) : now,
                startedAt: data.startedAt ? new Date(data.startedAt) : null,
                completedAt: data.completedAt ? new Date(data.completedAt) : null,
                timerStartedAt: null,
            },
            ...current,
        ]);
    };

    const onUpdate = async (id, patch) => {
        setTasks((current) =>
            current.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          ...patch,
                          receivedAt: patch.receivedAt !== undefined ? new Date(patch.receivedAt) : task.receivedAt,
                          startedAt: patch.startedAt !== undefined ? (patch.startedAt ? new Date(patch.startedAt) : null) : task.startedAt,
                          completedAt: patch.completedAt !== undefined ? (patch.completedAt ? new Date(patch.completedAt) : null) : task.completedAt,
                      }
                    : task
            )
        );
    };

    const onDelete = async (task) => {
        setTasks((current) => current.filter((t) => t.id !== task.id));
    };

    const onMoveStatus = async (task, newStatus) => {
        const patch = applyStatusTransition(task, newStatus, new Date());
        setTasks((current) => current.map((t) => (t.id === task.id ? { ...t, ...patch } : t)));
    };

    const onStartTimer = async (task) => {
        setTasks((current) =>
            current.map((t) => (t.id === task.id ? { ...t, timerStartedAt: new Date() } : t))
        );
    };

    const onStopTimer = async (task) => {
        const timeSpentMinutes = computeLiveTimeSpent(task, new Date());
        setTasks((current) =>
            current.map((t) => (t.id === task.id ? { ...t, timeSpentMinutes, timerStartedAt: null } : t))
        );
    };

    return (
        <div className="min-h-screen bg-white p-6 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                    Tareas — vista previa local (datos simulados)
                </h1>
                <TaskBoard
                    tasks={tasks}
                    loading={false}
                    onCreate={onCreate}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onMoveStatus={onMoveStatus}
                    onStartTimer={onStartTimer}
                    onStopTimer={onStopTimer}
                />
            </div>
        </div>
    );
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <KanbanPreview />
    </StrictMode>
);
