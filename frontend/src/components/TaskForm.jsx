import { useState } from 'react';
import { createTask } from '../api';
import toast from 'react-hot-toast';

export default function TaskForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const submit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    await createTask({ title: title.trim(), due_date: dueDate });
    toast.success('Task added ✅');
    setTitle('');
    setDueDate('');
    onSuccess();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">➕ Add Task</h3>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-400"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-400"
      />
      <button
        onClick={submit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        ➕ Add
      </button>
    </div>
  );
}
