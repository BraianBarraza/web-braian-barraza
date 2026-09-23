import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { applyStatusTransition, computeLiveTimeSpent } from "../components/tasks/taskUtils";
import { DEFAULT_STATUS, DEFAULT_TYPE } from "../components/tasks/taskConstants";

export const TASKS_COLLECTION = "tasks";

export const subscribeToTasks = (onChange, onError) => {
    const q = query(collection(db, TASKS_COLLECTION), orderBy("receivedAt", "desc"));
    return onSnapshot(
        q,
        (snapshot) => onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onError
    );
};

export const createTask = async (input) => {
    const now = serverTimestamp();
    const status = input.status || DEFAULT_STATUS;

    return addDoc(collection(db, TASKS_COLLECTION), {
        title: input.title.trim(),
        description: (input.description || "").trim(),
        client: input.client.trim(),
        projectId: input.projectId || null,
        type: input.type || DEFAULT_TYPE,
        status,
        receivedAt: input.receivedAt ? new Date(input.receivedAt) : now,
        startedAt: input.startedAt ? new Date(input.startedAt) : status !== "pending" ? now : null,
        completedAt: input.completedAt ? new Date(input.completedAt) : status === "resolved" ? now : null,
        timeSpentMinutes: Number(input.timeSpentMinutes) || 0,
        timerStartedAt: null,
        createdAt: now,
        updatedAt: now,
    });
};

export const updateTask = async (id, patch) =>
    updateDoc(doc(db, TASKS_COLLECTION, id), { ...patch, updatedAt: serverTimestamp() });

export const deleteTask = async (id) => deleteDoc(doc(db, TASKS_COLLECTION, id));

/**
 * Moves a task to a new status, applying the same side effects (startedAt /
 * completedAt / timer stamps) an AI agent should replicate if it writes to
 * Firestore directly instead of using this helper. See DOCS.md.
 */
export const moveTaskStatus = async (task, newStatus) => {
    const patch = applyStatusTransition(task, newStatus, new Date());
    if (Object.keys(patch).length === 0) return;
    await updateTask(task.id, patch);
};

export const startTaskTimer = async (task) => {
    if (task.timerStartedAt) return;
    await updateTask(task.id, { timerStartedAt: serverTimestamp() });
};

export const stopTaskTimer = async (task) => {
    if (!task.timerStartedAt) return;
    const timeSpentMinutes = computeLiveTimeSpent(task, new Date());
    await updateTask(task.id, { timeSpentMinutes, timerStartedAt: null });
};
