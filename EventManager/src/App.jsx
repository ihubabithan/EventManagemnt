import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Layout from './layouts/Layout'
import ErrorBoundary from '../components/common/ErrorBoundary'

// Pages
import HomePage from './pages/user/HomePage'
import EventDetails from './pages/user/EventDetails'
import SignUpPage from './pages/user/SignUp'
import LoginPage  from './Pages/user/Login'
import CreateEventPage from './pages/admin/CreateEventPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'

/**
 * Main Application Component
 * Handles routing, authentication, and global providers
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
              
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/events/:id" element={<Layout><EventDetails /></Layout>} />
                <Route 
                  path="/signup" 
                  element={
                    <Layout>
                      {({ isAuthenticated }) => (
                        isAuthenticated ? (
                          <Navigate to="/" replace />
                        ) : (
                          <SignUpPage />
                        )
                      )}
                    </Layout>
                  }
                />
                <Route 
                  path="/login" 
                  element={
                    <Layout>
                      {({ isAuthenticated }) => (
                        isAuthenticated ? (
                          <Navigate to="/" replace />
                        ) : (
                          <LoginPage />
                        )
                      )}
                    </Layout>
                  }
                />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout><AdminDashboardPage /></Layout>
                      
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/create-event" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout><CreateEventPage /></Layout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Page */}
                <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App