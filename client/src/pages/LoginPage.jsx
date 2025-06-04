import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import authStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const InputField = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    required
    onChange={onChange}
    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
  />
);

const AuthMessage = () =>
  authStore.error ? (
    <p className='text-red-500 text-sm text-center'>{authStore.error}</p>
  ) : authStore.successMessage ? (
    <p className='text-green-500 text-sm text-center'>{authStore.successMessage}</p>
  ) : null;

const LoginPage = observer(() => {
  const [authMode, setAuthMode] = useState('login');
  const [details, setDetails] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const updateField = (field) => (e) => setDetails({ ...details, [field]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = details;
    await authStore.login(username, password);
    if (authStore.isAuthenticated) navigate('/chat');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    authStore.error = null;
    const { username, password, confirmPassword } = details;
    await authStore.register(username, password, confirmPassword);
    if (authStore.successMessage) {
      setDetails({ username: '', password: '', confirmPassword: '' }); // reset form
    }
  };
  const handleModeSwitch = (mode) => {
    setAuthMode(mode);
    authStore.error = null;
    authStore.successMessage = null;
    setDetails({ username: '', password: '', confirmPassword: '' }); // reset form on switch
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4'>
      <h1 className='text-3xl font-bold mb-8 text-gray-800'>Welcome to AI Chat</h1>

      <div className='bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden'>
        {/* Tabs */}
        <div className='flex justify-evenly border-b-2 border-gray-200'>
          {['login', 'register'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeSwitch(mode)}
              className={`w-1/2 py-3 text-xl font-semibold transition-all duration-300 cursor-pointer ${
                authMode === mode ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Sliding Form Container */}
        <div className='relative w-full h-[360px]'>
          <div
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out transform ${
              authMode === 'register' ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              className='absolute w-full h-full px-8 pt-8 lg:pt-12 lg:space-y-8 space-y-6 bg-white'
            >
              <InputField
                type='text'
                placeholder='Username'
                value={details.username}
                onChange={updateField('username')}
              />
              <InputField
                type='password'
                placeholder='Password'
                value={details.password}
                onChange={updateField('password')}
              />
              <button
                type='submit'
                className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer'
              >
                {authStore.authLoading ? 'Logging in...' : 'Login'}
              </button>
              <AuthMessage />
            </form>

            {/* Register Form */}
            <form
              onSubmit={handleRegister}
              className='absolute w-full h-full left-full px-8 pt-8 space-y-6 bg-white'
            >
              <InputField
                type='text'
                placeholder='Username'
                value={details.username}
                onChange={updateField('username')}
              />
              <InputField
                type='password'
                placeholder='Password'
                value={details.password}
                onChange={updateField('password')}
              />
              <InputField
                type='password'
                placeholder='Confirm Password'
                value={details.confirmPassword}
                onChange={updateField('confirmPassword')}
              />
              <button
                type='submit'
                className='w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200 cursor-pointer'
              >
                {authStore.authLoading ? 'Registering...' : 'Register'}
              </button>
              <AuthMessage />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoginPage;
