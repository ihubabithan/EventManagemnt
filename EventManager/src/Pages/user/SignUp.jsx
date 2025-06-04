import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Eye, EyeOff, Calendar, User, Mail, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/Card'
import Button from '../../../components/Button'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'

// Validation Schema
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
  isAdmin: Yup.boolean()
})

/**
 * Signup Page Component
 * Handles user registration
 */
const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  /**
   * Handle form submission
   */
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setLoading(true)
    
    try {
      console.log('Form values:', values); // Debug log
      const registrationData = {
        username: values.name,
        email: values.email,
        password: values.password,
        role: values.isAdmin ? 'admin' : 'user'
      };
      console.log('Registration data:', registrationData);
      const result = await register(registrationData)
      
      if (result.success) {
        toast.success('Registration successful!')
        navigate('/')
      } else {
        toast.error(result.error)
        // Set field-specific errors if needed
        if (result.error.includes('email')) {
          setFieldError('email', result.error)
        } else if (result.error.includes('name')) {
          setFieldError('name', result.error)
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-muted-foreground">
            Join EventHive to discover amazing events
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                isAdmin: false
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  {/* Name Field */}
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <User className="absolute left-3 top-[42px] h-4 w-4 text-muted-foreground" />
                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.name && touched.name 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage 
                      name="name" 
                      component="div" 
                      className="text-red-500 text-sm mt-1" 
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Mail className="absolute left-3 top-[42px] h-4 w-4 text-muted-foreground" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.email && touched.email 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage 
                      name="email" 
                      component="div" 
                      className="text-red-500 text-sm mt-1" 
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <Lock className="absolute left-3 top-[42px] h-4 w-4 text-muted-foreground" />
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.password && touched.password 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[42px] text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <ErrorMessage 
                      name="password" 
                      component="div" 
                      className="text-red-500 text-sm mt-1" 
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <Lock className="absolute left-3 top-[42px] h-4 w-4 text-muted-foreground" />
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.confirmPassword && touched.confirmPassword 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-[42px] text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <ErrorMessage 
                      name="confirmPassword" 
                      component="div" 
                      className="text-red-500 text-sm mt-1" 
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      id="isAdmin"
                      name="isAdmin"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isAdmin" className="text-sm font-medium cursor-pointer">
                      Register as Admin
                    </label>
                    <ErrorMessage 
                      name="isAdmin" 
                      component="div" 
                      className="text-red-500 text-sm" 
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={loading}
                    disabled={loading || isSubmitting}
                  >
                    Create Account
                  </Button>

                  {/* Login Link */}
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary hover:underline">
                        Sign in here
                      </Link>
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>.
        </div>
      </div>
    </div>
  )
}

export default SignupPage