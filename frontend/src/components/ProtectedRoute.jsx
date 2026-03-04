import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component />;
};

export default ProtectedRoute;
