import { useTasks } from "../../hooks/useTasks";
import { createTask, updateTask, deleteTask, moveTaskStatus, startTaskTimer, stopTaskTimer } from "../../lib/tasks";
import TaskBoard from "./TaskBoard";

const TasksPanel = () => {
    const { tasks, loading, error } = useTasks();

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
                Error loading tasks: {error.message}
            </div>
        );
    }

    return (
        <TaskBoard
            tasks={tasks}
            loading={loading}
            onCreate={createTask}
            onUpdate={updateTask}
            onDelete={(task) => deleteTask(task.id)}
            onMoveStatus={moveTaskStatus}
            onStartTimer={startTaskTimer}
            onStopTimer={stopTaskTimer}
        />
    );
};

export default TasksPanel;
