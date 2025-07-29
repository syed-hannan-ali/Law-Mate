import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '@stores/authStore';
import Login from '@components/auth/Login';
import Signup from '@components/auth/Signup';
import OAuthSuccess from '@components/auth/OAuthSuccess';
import ProtectedRoute from '@components/common/ProtectedRoute';
import LegalLandingPage from '@components/LegalLandingPage';
import AdminDashboard from '@pages/AdminPage';

export default function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    // Initialize auth state on app startup
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>  
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LegalLandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard/>
            </ProtectedRoute>
          } 
        />
        {/* Add more protected routes here */}
      </Routes>
    </Router>
  );
}