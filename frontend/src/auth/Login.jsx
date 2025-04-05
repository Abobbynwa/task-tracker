import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import toast from 'react-hot-toast';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful ✅');
      onLogin(); // update auth state
      navigate('/dashboard'); // 🚀 redirect
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-center">🔐 Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        autoComplete="current-password"
      />
      <button
        onClick={submit}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Login
      </button>
    </div>
  );
}
