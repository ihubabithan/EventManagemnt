import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Protected Route Component
 * Handles route protection based on authentication and role requirements
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected content
 * @param {string} props.requiredRole - Required user role
 * @param {string} props.redirectTo - Redirect path for unauthorized access
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/signup' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()
  console.log({user})

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Verifying authentication...
          </p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          error: `Access denied. ${requiredRole} role required.`,
          from: location 
        }} 
        replace 
      />
    )
  }

  // Render protected content
  return children
}

export default ProtectedRoute