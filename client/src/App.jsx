import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './redux/thunks/authThunks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

import SocketStatusBanner from './components/SocketStatusBanner';

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <Router>
      <SocketStatusBanner />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/chat" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/chat" /> : <Signup />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
}

export default App;
