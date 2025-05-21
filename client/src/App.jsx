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

  if (authStore.loading) {
    return <div>Loading...</div>; // Show loading state while fetching user data
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
