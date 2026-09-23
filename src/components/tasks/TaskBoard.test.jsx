import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TaskBoard from "./TaskBoard";

const buildTask = (overrides) => ({
    id: overrides.id,
    title: overrides.title,
    description: "",
    client: overrides.client,
    type: overrides.type || "feature",
    status: overrides.status || "pending",
    receivedAt: new Date("2026-01-01T00:00:00Z"),
    startedAt: null,
    completedAt: overrides.status === "resolved" ? new Date("2026-01-05T00:00:00Z") : null,
    timeSpentMinutes: overrides.timeSpentMinutes || 0,
    timerStartedAt: null,
    ...overrides,
});

const mockTasks = [
    buildTask({ id: "1", title: "Login bug", client: "Acme", type: "bug", status: "pending" }),
    buildTask({ id: "2", title: "New dashboard", client: "Acme", type: "feature", status: "in_progress" }),
    buildTask({
        id: "3",
        title: "Update deps",
        client: "Globex",
        type: "chore",
        status: "resolved",
        timeSpentMinutes: 90,
    }),
];

const noop = () => Promise.resolve();

const renderBoard = (overrides = {}) =>
    render(
        <TaskBoard
            tasks={mockTasks}
            loading={false}
            onCreate={vi.fn(noop)}
            onUpdate={vi.fn(noop)}
            onDelete={vi.fn(noop)}
            onMoveStatus={vi.fn(noop)}
            onStartTimer={vi.fn(noop)}
            onStopTimer={vi.fn(noop)}
            {...overrides}
        />
    );

describe("TaskBoard", () => {
    it("renders the three status columns with their task counts", () => {
        renderBoard();
        expect(screen.getByRole("heading", { name: "Pendiente" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "En proceso" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Resuelto" })).toBeInTheDocument();
        expect(screen.getByText("Login bug")).toBeInTheDocument();
        expect(screen.getByText("New dashboard")).toBeInTheDocument();
    });

    it("filters the board by client", () => {
        renderBoard();
        fireEvent.change(screen.getByLabelText("Filtrar por cliente"), {
            target: { value: "Globex" },
        });
        expect(screen.queryByText("Login bug")).not.toBeInTheDocument();
        expect(screen.getByText("Update deps")).toBeInTheDocument();
    });

    it("opens the create form when clicking 'Nueva tarea'", () => {
        renderBoard();
        fireEvent.click(screen.getByText("Nueva tarea"));
        expect(screen.getByText("Título *")).toBeInTheDocument();
    });

    it("shows resolved tasks with their total time in the history view", () => {
        renderBoard();
        fireEvent.click(screen.getByText("Historial"));
        expect(screen.getByText("Update deps")).toBeInTheDocument();
        expect(screen.getByText(/Tiempo total: 1h 30m/)).toBeInTheDocument();
        expect(screen.queryByText("Login bug")).not.toBeInTheDocument();
    });

    it("shows an empty state per column when there are no tasks", () => {
        renderBoard({ tasks: [] });
        expect(screen.getAllByText("Sin tareas")).toHaveLength(3);
    });
});
