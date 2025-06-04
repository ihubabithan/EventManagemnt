/**
 * Validation utility functions for form inputs
 */

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validates password strength
 * Requirements: At least 8 characters, uppercase, lowercase, number, and special character
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets requirements, false otherwise
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false
  }
  
  // At least 8 characters
  if (password.length < 8) {
    return false
  }
  
  // Contains uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false
  }
  
  // Contains lowercase letter
  if (!/[a-z]/.test(password)) {
    return false
  }
  
  // Contains number
  if (!/\d/.test(password)) {
    return false
  }
  
  // Contains special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false
  }
  
  return true
}

/**
 * Validates name format (letters and spaces only)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if name is valid, false otherwise
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return false
  }
  
  const trimmedName = name.trim()
  
  // Must be at least 2 characters
  if (trimmedName.length < 2) {
    return false
  }
  
  // Only letters and spaces allowed
  const nameRegex = /^[a-zA-Z\s]+$/
  return nameRegex.test(trimmedName)
}

/**
 * Validates phone number format
 * Supports various formats: (123) 456-7890, 123-456-7890, 1234567890, +1234567890
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone number is valid, false otherwise
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false
  }
  
  // Remove all non-digit characters except +
  const cleanedPhone = phone.replace(/[^\d+]/g, '')
  
  // Check for valid phone number patterns
  const phoneRegex = /^(\+?1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/
  return phoneRegex.test(cleanedPhone)
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is valid, false otherwise
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validates age (must be between 13 and 120)
 * @param {number|string} age - Age to validate
 * @returns {boolean} - True if age is valid, false otherwise
 */
export const validateAge = (age) => {
  const numAge = Number(age)
  
  if (isNaN(numAge) || !Number.isInteger(numAge)) {
    return false
  }
  
  return numAge >= 13 && numAge <= 120
}

/**
 * Validates date format and ensures it's not in the future
 * @param {string} date - Date string to validate (YYYY-MM-DD format)
 * @returns {boolean} - True if date is valid, false otherwise
 */
export const validateBirthDate = (date) => {
  if (!date || typeof date !== 'string') {
    return false
  }
  
  const dateObj = new Date(date)
  const today = new Date()
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return false
  }
  
  // Check if date is not in the future
  if (dateObj > today) {
    return false
  }
  
  // Check if date is not too far in the past (150 years)
  const minDate = new Date()
  minDate.setFullYear(today.getFullYear() - 150)
  
  return dateObj >= minDate
}

/**
 * Validates required field (not empty, null, or undefined)
 * @param {any} value - Value to validate
 * @returns {boolean} - True if value is present, false otherwise
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) {
    return false
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  
  if (Array.isArray(value)) {
    return value.length > 0
  }
  
  return Boolean(value)
}

/**
 * Validates string length within specified range
 * @param {string} value - String to validate
 * @param {number} min - Minimum length (default: 0)
 * @param {number} max - Maximum length (default: Infinity)
 * @returns {boolean} - True if length is within range, false otherwise
 */
export const validateLength = (value, min = 0, max = Infinity) => {
  if (!value || typeof value !== 'string') {
    return false
  }
  
  const length = value.trim().length
  return length >= min && length <= max
}

/**
 * Validates postal/zip code format
 * Supports US ZIP codes (12345 or 12345-6789) and basic international formats
 * @param {string} postalCode - Postal code to validate
 * @param {string} country - Country code (default: 'US')
 * @returns {boolean} - True if postal code is valid, false otherwise
 */
export const validatePostalCode = (postalCode, country = 'US') => {
  if (!postalCode || typeof postalCode !== 'string') {
    return false
  }
  
  const cleanedCode = postalCode.trim()
  
  switch (country.toUpperCase()) {
    case 'US':
      return /^\d{5}(-\d{4})?$/.test(cleanedCode)
    case 'CA':
      return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(cleanedCode)
    case 'UK':
    case 'GB':
      return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(cleanedCode)
    default:
      // Basic validation for other countries (alphanumeric, 3-10 characters)
      return /^[A-Za-z\d\s-]{3,10}$/.test(cleanedCode)
  }
}

/**
 * Validates credit card number using Luhn algorithm
 * @param {string} cardNumber - Credit card number to validate
 * @returns {boolean} - True if card number is valid, false otherwise
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return false
  }
  
  // Remove all non-digit characters
  const cleanedNumber = cardNumber.replace(/\D/g, '')
  
  // Check if it's between 13-19 digits
  if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
    return false
  }
  
  // Luhn algorithm
  let sum = 0
  let isEven = false
  
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * Comprehensive form validation helper
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} - Object with isValid boolean and errors object
 */
export const validateForm = (formData, validationRules) => {
  const errors = {}
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field]
    
    for (const rule of rules) {
      let isValid = true
      let errorMessage = ''
      
      switch (rule.type) {
        case 'required':
          isValid = validateRequired(value)
          errorMessage = rule.message || `${field} is required`
          break
        case 'email':
          isValid = !value || validateEmail(value)
          errorMessage = rule.message || 'Please enter a valid email address'
          break
        case 'password':
          isValid = !value || validatePassword(value)
          errorMessage = rule.message || 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
          break
        case 'name':
          isValid = !value || validateName(value)
          errorMessage = rule.message || 'Name must contain only letters and spaces'
          break
        case 'length':
          isValid = !value || validateLength(value, rule.min, rule.max)
          errorMessage = rule.message || `Must be between ${rule.min} and ${rule.max} characters`
          break
        case 'match':
          isValid = !value || value === formData[rule.field]
          errorMessage = rule.message || `Must match ${rule.field}`
          break
        default:
          if (typeof rule.validator === 'function') {
            isValid = rule.validator(value)
            errorMessage = rule.message || 'Invalid value'
          }
      }
      
      if (!isValid) {
        errors[field] = errorMessage
        break // Stop at first error for this field
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Export all validation functions as default object
export default {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateUrl,
  validateAge,
  validateBirthDate,
  validateRequired,
  validateLength,
  validatePostalCode,
  validateCreditCard,
  validateForm
}