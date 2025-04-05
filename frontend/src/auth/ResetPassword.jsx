import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ResetPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const reset = async () => {
    try {
      await axios.post('http://localhost:5000/auth/reset-password', {
        email,
        new_password: newPassword,
      });
      toast.success('Password reset ✅');
      onBack();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">🔁 Reset Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
      />
      <button onClick={reset} className="bg-yellow-500 text-white px-4 py-2 rounded">
        Reset Password
      </button>
      <p className="text-sm">
        <button onClick={onBack} className="text-blue-500 underline">Back to login</button>
      </p>
    </div>
  );
}
