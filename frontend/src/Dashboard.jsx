import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, getStats } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Stats from './components/Stats';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const loadData = async () => {
    try {
      const [taskRes, statsRes] = await Promise.all([
        getTasks(),
        getStats(),
      ]);
      setTasks(taskRes.data);
      setStats(statsRes.data);
    } catch (err) {
      logout(); // token invalid or expired
    }
  };

  useEffect(() => {
    loadData();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">🧠 Task Tracker</h1>
          <button
            onClick={logout}
            className="text-sm bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Logout
          </button>
        </div>

        <Stats stats={stats} />
        <TaskForm onSuccess={() => setRefresh(!refresh)} />
        <TaskList tasks={tasks} onUpdate={() => setRefresh(!refresh)} />
      </div>
    </div>
  );
}
