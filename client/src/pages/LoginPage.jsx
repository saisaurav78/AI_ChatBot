import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import authStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = observer(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await authStore.login(username, password);
    if (authStore.isAuthenticated) {
      navigate('/chat');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4'>
      <h1 className='text-3xl font-bold mb-8 text-gray-800'>Welcome to AI Chat</h1>

      <form
        onSubmit={handleLogin}
        className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4'
      >
        <h2 className='text-2xl font-semibold text-center text-gray-700'>Login</h2>

        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        {authStore.error && <p className='text-red-500 text-sm text-center'>{authStore.error}</p>}

        <div className='text-gray-500 text-sm text-center'>
          <p>username: user</p>
          <p>password: user123</p>
        </div>

        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200'
        >
          Login
        </button>
      </form>
    </div>
  );
});

export default LoginPage;
