import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, getStats } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Stats from './components/Stats';
import Login from './auth/Login';
import Register from './auth/Register';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const loadData = async () => {
    try {
      const resTasks = await getTasks();
      const resStats = await getStats();
      setTasks(resTasks.data);
      setStats(resStats.data);
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    if (loggedIn) {
      loadData();
      navigate('/'); // ✅ auto-navigate after login
    }
  }, [refresh, loggedIn]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Toaster position="top-center" />
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
          {authMode === 'login' ? (
            <>
              <Login onLogin={() => setLoggedIn(true)} />
              <p className="text-sm text-center">
                No account?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-blue-500 underline"
                >
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <Register onRegister={() => setLoggedIn(true)} />
              <p className="text-sm text-center">
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-blue-500 underline"
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // =====================
  // 🧠 MAIN DASHBOARD UI
  // =====================

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <Toaster position="top-center" />
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
