import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import DonorDashboard from './components/DonorDashboard';
import SeekerDashboard from './components/SeekerDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
            <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
            <Route path="/donor-dashboard" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
            <Route path="/seeker-dashboard" element={<ProtectedRoute><SeekerDashboard /></ProtectedRoute>} />
            <Route path="/" element={<HomeRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  // Check if user exists and has valid authentication
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  
  if (user) {
    // Redirect to appropriate dashboard based on user type
    if (user.userType === 'donor') {
      return <Navigate to="/donor-dashboard" />;
    } else {
      return <Navigate to="/seeker-dashboard" />;
    }
  }
  
  return <Navigate to="/login" />;
}

function AuthRedirect({ children }) {
  const { user } = useAuth();
  
  if (user) {
    // If user is already logged in, redirect to dashboard
    if (user.userType === 'donor') {
      return <Navigate to="/donor-dashboard" />;
    } else {
      return <Navigate to="/seeker-dashboard" />;
    }
  }
  
  return children;
}

export default App;