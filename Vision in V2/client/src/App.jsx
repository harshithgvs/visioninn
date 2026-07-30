import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { HomeFeed } from './pages/HomeFeed';
import { IdeaVault } from './pages/IdeaVault';
import { CoFounders } from './pages/CoFounders';
import { LearningHub } from './pages/LearningHub';
import { Careers } from './pages/Careers';
import { Funding } from './pages/Funding';
import { LegalCenter } from './pages/LegalCenter';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

// Protected Route Guard - Redirects unauthenticated visitors strictly to /login
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route Guard - Restricts access to Super Admin only
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Unauthenticated Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Core Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HomeFeed />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/idea-vault"
              element={
                <ProtectedRoute>
                  <Layout>
                    <IdeaVault />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/co-founders"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CoFounders />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/learning"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LearningHub />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Careers />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/funding"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Funding />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/legal"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LegalCenter />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Search />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Layout hideSidebars={true}>
                    <AdminDashboard />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Catch-all 404 Route */}
            <Route
              path="*"
              element={
                <Layout hideSidebars={true}>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
