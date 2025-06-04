import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../utils/api'
import { tokenManager } from '../utils/tokenManager'

const AuthContext = createContext({})

/**
 * Authentication Provider Component
 * Manages user authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = tokenManager.getToken()
        if (token) {
          const response = await authApi.verifyToken()
          setUser(response.data)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        tokenManager.removeToken()
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (admin/user)
   */
  const login = async (email, password, role = 'user') => {
    try {
      setIsLoading(true)
      const response = await authApi.login(email, password, role)
      const { token, user: userData } = response.data
      
      tokenManager.setToken(token)
      setUser(userData)
      setIsAuthenticated(true)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} role - User role (admin/user)
   */
  const register = async (userData) => {
    try {
      setIsLoading(true)
      const response = await authApi.register(userData)
      const { token, user: newUser } = response.data
      
      tokenManager.setToken(token)
      setUser(newUser)
      setIsAuthenticated(true)
      
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout current user
   */
  const logout = () => {
    tokenManager.removeToken()
    setUser(null)
    setIsAuthenticated(false)
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   */
  const hasRole = (role) => {
    return user?.role === role
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext