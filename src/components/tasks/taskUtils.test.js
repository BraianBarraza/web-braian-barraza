import { describe, expect, it } from "vitest";
import {
    applyStatusTransition,
    computeElapsedMinutes,
    computeLiveTimeSpent,
    filterTasks,
    formatDuration,
    formatShortDate,
    getClientOptions,
    getStatusMeta,
    getTypeMeta,
    groupTasksByStatus,
    sortByCompletedDesc,
    sortByReceivedDesc,
    toDate,
} from "./taskUtils";

const firestoreTimestamp = (date) => ({ toDate: () => date });

describe("toDate", () => {
    it("returns null for falsy values", () => {
        expect(toDate(null)).toBeNull();
        expect(toDate(undefined)).toBeNull();
    });

    it("passes through native Date instances", () => {
        const date = new Date("2026-01-01T00:00:00Z");
        expect(toDate(date)).toBe(date);
    });

    it("unwraps Firestore-style Timestamp objects", () => {
        const date = new Date("2026-01-01T00:00:00Z");
        expect(toDate(firestoreTimestamp(date))).toBe(date);
    });

    it("converts epoch numbers", () => {
        const result = toDate(0);
        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBe(0);
    });
});

describe("getStatusMeta / getTypeMeta", () => {
    it("finds a known status and type", () => {
        expect(getStatusMeta("in_progress").label).toBe("En proceso");
        expect(getTypeMeta("bug").label).toBe("Bug");
    });

    it("falls back to the first entry for unknown ids", () => {
        expect(getStatusMeta("unknown").id).toBe("pending");
        expect(getTypeMeta("unknown").id).toBe("bug");
    });
});

describe("groupTasksByStatus", () => {
    it("buckets tasks by their status, defaulting unknown statuses to pending", () => {
        const tasks = [
            { id: "1", status: "pending" },
            { id: "2", status: "in_progress" },
            { id: "3", status: "resolved" },
            { id: "4", status: "weird" },
        ];
        const groups = groupTasksByStatus(tasks);
        expect(groups.pending.map((t) => t.id)).toEqual(["1", "4"]);
        expect(groups.in_progress.map((t) => t.id)).toEqual(["2"]);
        expect(groups.resolved.map((t) => t.id)).toEqual(["3"]);
    });
});

describe("filterTasks", () => {
    const tasks = [
        { id: "1", client: "Acme", type: "bug" },
        { id: "2", client: "Acme", type: "feature" },
        { id: "3", client: "Globex", type: "bug" },
    ];

    it("returns everything when filters are 'all' or omitted", () => {
        expect(filterTasks(tasks)).toHaveLength(3);
        expect(filterTasks(tasks, { client: "all", type: "all" })).toHaveLength(3);
    });

    it("filters by client", () => {
        expect(filterTasks(tasks, { client: "Acme" }).map((t) => t.id)).toEqual(["1", "2"]);
    });

    it("filters by type", () => {
        expect(filterTasks(tasks, { type: "bug" }).map((t) => t.id)).toEqual(["1", "3"]);
    });

    it("combines both filters", () => {
        expect(filterTasks(tasks, { client: "Acme", type: "bug" }).map((t) => t.id)).toEqual(["1"]);
    });
});

describe("getClientOptions", () => {
    it("returns unique, sorted, non-empty client names", () => {
        const tasks = [
            { client: "Zeta" },
            { client: "Acme" },
            { client: "Acme" },
            { client: "" },
            { client: null },
        ];
        expect(getClientOptions(tasks)).toEqual(["Acme", "Zeta"]);
    });
});

describe("formatDuration", () => {
    it("formats minutes only", () => {
        expect(formatDuration(0)).toBe("0m");
        expect(formatDuration(45)).toBe("45m");
    });

    it("formats whole hours", () => {
        expect(formatDuration(120)).toBe("2h");
    });

    it("formats hours and minutes", () => {
        expect(formatDuration(135)).toBe("2h 15m");
    });

    it("clamps negative or missing values to 0m", () => {
        expect(formatDuration(-10)).toBe("0m");
        expect(formatDuration(undefined)).toBe("0m");
    });
});

describe("computeElapsedMinutes", () => {
    it("returns 0 when no timer is running", () => {
        expect(computeElapsedMinutes(null)).toBe(0);
    });

    it("computes elapsed minutes between the timer start and now", () => {
        const start = new Date("2026-01-01T10:00:00Z");
        const now = new Date("2026-01-01T10:30:00Z");
        expect(computeElapsedMinutes(start, now)).toBe(30);
    });
});

describe("computeLiveTimeSpent", () => {
    it("returns the stored total when no timer is running", () => {
        const task = { timeSpentMinutes: 60, timerStartedAt: null };
        expect(computeLiveTimeSpent(task)).toBe(60);
    });

    it("adds the live elapsed time while a timer is running", () => {
        const start = new Date("2026-01-01T10:00:00Z");
        const now = new Date("2026-01-01T10:15:00Z");
        const task = { timeSpentMinutes: 60, timerStartedAt: start };
        expect(computeLiveTimeSpent(task, now)).toBe(75);
    });
});

describe("applyStatusTransition", () => {
    const now = new Date("2026-02-01T12:00:00Z");

    it("returns an empty patch when the status does not change", () => {
        const task = { status: "pending" };
        expect(applyStatusTransition(task, "pending", now)).toEqual({});
    });

    it("stamps startedAt the first time a task enters in_progress", () => {
        const task = { status: "pending", startedAt: null };
        const patch = applyStatusTransition(task, "in_progress", now);
        expect(patch.status).toBe("in_progress");
        expect(patch.startedAt).toBe(now);
    });

    it("does not overwrite an existing startedAt", () => {
        const existingStart = new Date("2026-01-15T00:00:00Z");
        const task = { status: "pending", startedAt: existingStart };
        const patch = applyStatusTransition(task, "in_progress", now);
        expect(patch.startedAt).toBeUndefined();
    });

    it("stamps completedAt when resolving a task", () => {
        const task = { status: "in_progress", completedAt: null, timerStartedAt: null };
        const patch = applyStatusTransition(task, "resolved", now);
        expect(patch.completedAt).toBe(now);
    });

    it("stops a running timer and commits its time when resolving", () => {
        const start = new Date("2026-02-01T11:00:00Z");
        const task = {
            status: "in_progress",
            completedAt: null,
            timeSpentMinutes: 30,
            timerStartedAt: start,
        };
        const patch = applyStatusTransition(task, "resolved", now);
        expect(patch.timeSpentMinutes).toBe(90);
        expect(patch.timerStartedAt).toBeNull();
    });

    it("clears completedAt when moving a task away from resolved", () => {
        const task = { status: "resolved", completedAt: new Date("2026-01-20T00:00:00Z") };
        const patch = applyStatusTransition(task, "in_progress", now);
        expect(patch.completedAt).toBeNull();
    });
});

describe("formatShortDate", () => {
    it("returns an em dash placeholder for missing dates", () => {
        expect(formatShortDate(null)).toBe("—");
    });

    it("formats a valid date", () => {
        expect(formatShortDate(new Date("2026-03-05T00:00:00Z"))).toMatch(/\d{2}/);
    });
});

describe("sortByReceivedDesc / sortByCompletedDesc", () => {
    it("orders tasks by receivedAt, most recent first", () => {
        const tasks = [
            { id: "old", receivedAt: new Date("2026-01-01T00:00:00Z") },
            { id: "new", receivedAt: new Date("2026-03-01T00:00:00Z") },
        ];
        expect(sortByReceivedDesc(tasks).map((t) => t.id)).toEqual(["new", "old"]);
    });

    it("orders tasks by completedAt, most recent first", () => {
        const tasks = [
            { id: "old", completedAt: new Date("2026-01-01T00:00:00Z") },
            { id: "new", completedAt: new Date("2026-03-01T00:00:00Z") },
        ];
        expect(sortByCompletedDesc(tasks).map((t) => t.id)).toEqual(["new", "old"]);
    });
});
