import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Calendar, LogOut, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/Button'

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActivePath = (path) => location.pathname === path

  const content =
    typeof children === 'function' ? children({ isAuthenticated, user }) : children

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">EventHive</span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              {(!isAuthenticated || (isAuthenticated && user?.role !== 'admin')) && (
                <Link
                  to="/"
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    isActivePath('/') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Events
                </Link>
              )}

              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link
                    to="/"
                    className={`text-sm font-medium hover:text-primary transition-colors ${
                      isActivePath('/') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/create-event"
                    className={`text-sm font-medium hover:text-primary transition-colors ${
                      isActivePath('/admin/create-event') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Create Event
                  </Link>
                </>
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Auth Actions */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      ({user?.role})
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => navigate('/signup')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {content}
      </main>
    </div>
  )
}

export default Layout
