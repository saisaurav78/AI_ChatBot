import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { observer } from 'mobx-react-lite';
import authStore from './store/authStore';

const App = observer(() => {
  const location = useLocation(); // Get current location for redirect after login

  useEffect(() => {
    authStore.fetchUser(); // Fetch user auth status on component mount
  }, []);

  // Improved loading screen UI with centered spinner and dark modal overlay
  if (authStore.loading) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 border-solid'></div>
        <p className='mt-4 text-lg text-gray-200 font-semibold'>
          Hang tight... Preparing your chat 🤖
        </p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path='/'
        element={authStore.isAuthenticated ? <Navigate to='/chat' replace /> : <LoginPage />}
        // Redirect to chat if authenticated, else show login
      />
      <Route
        path='/chat'
        element={
          authStore.isAuthenticated ? (
            <ChatPage />
          ) : (
            <Navigate to='/' replace state={{ from: location }} />
            // Protect chat route; redirect unauthenticated users to login
          )
        }
      />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
});

export default App;
