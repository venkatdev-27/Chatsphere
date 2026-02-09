import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Home from './pages/Home';
import AuthLayout from './components/layout/AuthLayout';
import { checkAuth } from './redux/thunks/authThunks';
import Loader from './components/animate-ui/icons/loader';
import SocketStatusBanner from './components/SocketStatusBanner';
import ErrorBoundary from './components/common/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <Loader size={50} className="text-indigo-400" />
      </div>
    );
  }

  return (
    <Router>
      <ErrorBoundary>
        <SocketStatusBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/chat" replace /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/chat" replace /> : <Signup />} />
          </Route>

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
