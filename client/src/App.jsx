import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { observer } from 'mobx-react-lite';
import authStore from './store/authStore';


const App = observer(() => {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route
        path='/chat'
        element={authStore.isAuthenticated ? <ChatPage /> : <Navigate to='/' replace />}
      />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
});

export default App;
