import { deleteTask, updateTask } from '../api';
import toast from 'react-hot-toast';

export default function TaskList({ tasks, onUpdate }) {
  const handleDelete = async (id) => {
    await deleteTask(id);
    toast.success("Task deleted ✅");
    onUpdate();
  };

  const cycleStatus = (task) => {
    const order = ['todo', 'in-progress', 'done'];
    const idx = order.indexOf(task.status);
    return order[(idx + 1) % order.length];
  };

  const handleUpdate = async (task) => {
    const newStatus = cycleStatus(task);
    await updateTask(task.id, { status: newStatus });
    toast.success(`Status changed to "${newStatus}"`);
    onUpdate();
  };

  const getCountdown = (dueDate) => {
    if (!dueDate) return null;
    const diff = new Date(dueDate) - new Date();
    if (diff < 0) return '🕒 Overdue';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `⏳ ${days} day${days !== 1 ? 's' : ''} left`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">🧾 Task List</h3>
      {tasks.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No tasks yet. Add some to get started!</p>
      )}
      <ul className="space-y-3">
        {tasks.map(task => (
          <li
            key={task.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex-1">
              <h4 className="text-lg font-medium">{task.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: <span className="capitalize">{task.status}</span>{' '}
                {task.due_date && (
                  <>
                    <span className="ml-2 italic">(Due: {task.due_date})</span>
                    <br />
                    <span className="text-xs">{getCountdown(task.due_date)}</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate(task)}
                className="px-3 py-1 text-sm rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-600 transition"
              >
                🔄 Update
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="px-3 py-1 text-sm rounded bg-red-100 dark:bg-red-700 text-red-800 dark:text-white hover:bg-red-200 dark:hover:bg-red-600 transition"
              >
                ❌ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
