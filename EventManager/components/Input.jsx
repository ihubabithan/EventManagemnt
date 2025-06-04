import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Enhanced Input Component
 * A flexible form input component with validation support and password toggle
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Input type
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field indicator
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {React.Ref} ref - Forward ref
 */
const Input = React.forwardRef(({ 
  className = "",
  type = "text",
  label,
  error,
  placeholder,
  required = false,
  disabled = false,
  value,
  onChange,
  id,
  name,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`
  
  // Determine actual input type (for password toggle)
  const actualType = type === 'password' && showPassword ? 'text' : type
  const isPasswordType = type === 'password'

  // Enhanced base input classes with better styling
  const baseClasses = `
    flex h-12 w-full rounded-lg border-2 transition-all duration-200 ease-in-out
    bg-white 
    px-4 py-3 text-sm font-medium
    placeholder:text-gray-400 
    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
    hover:border-gray-300
    disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 
    ${isPasswordType ? 'pr-12' : ''}
  `.trim().replace(/\s+/g, ' ')
  
  // Dynamic border and ring colors based on state
  const stateClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
    : "border-gray-200 "
  
  // Combine all classes
  const inputClasses = [baseClasses, stateClasses, className].filter(Boolean).join(" ")

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700  mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1 font-normal">*</span>
          )}
        </label>
      )}
      
      <div className="relative">
        <input
          type={actualType}
          className={inputClasses}
          ref={ref}
          id={inputId}
          name={name}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        
        {isPasswordType && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-1 h-1 bg-red-500 rounded-full mt-2"></div>
          <p 
            id={`${inputId}-error`}
            className="text-sm text-red-600font-medium"
            role="alert"
          >
            {error}
          </p>
        </div>
      )}
    </div>
  )
})

export default Input