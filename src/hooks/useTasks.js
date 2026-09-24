import { useEffect, useState } from "react";
import { subscribeToTasks } from "../lib/tasks";

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToTasks(
            (data) => {
                setTasks(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    return { tasks, loading, error };
};
