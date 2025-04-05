import { useState } from 'react';
import { register } from '../api';
import toast from 'react-hot-toast';

export default function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = async () => {
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const res = await register({ email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Registered and logged in 🎉');
      onRegister();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-center">🆕 Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500"
      />
      <button
        onClick={submit}
        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        Register
      </button>
    </div>
  );
}
