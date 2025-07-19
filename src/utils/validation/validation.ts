/**
 * Validation utility functions
 */

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Password validation
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): ValidationResult {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters long` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true };
}

/**
 * URL validation
 */
export function validateUrl(url: string, requireHttps: boolean = false): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);

    if (requireHttps && urlObj.protocol !== 'https:') {
      return { isValid: false, error: 'URL must use HTTPS protocol' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Phone number validation (US format)
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Check for valid US phone number (10 or 11 digits)
  if (digits.length === 10 || (digits.length === 11 && digits[0] === '1')) {
    return { isValid: true };
  }

  return { isValid: false, error: 'Please enter a valid phone number' };
}

/**
 * Credit card validation (basic Luhn algorithm)
 */
export function validateCreditCard(cardNumber: string): ValidationResult {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return { isValid: false, error: 'Card number is required' };
  }

  // Remove spaces and dashes
  const digits = cardNumber.replace(/[\s-]/g, '');

  // Check if all characters are digits
  if (!/^\d+$/.test(digits)) {
    return { isValid: false, error: 'Card number must contain only digits' };
  }

  // Check length (most cards are 13-19 digits)
  if (digits.length < 13 || digits.length > 19) {
    return { isValid: false, error: 'Invalid card number length' };
  }

  // Luhn algorithm
  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i] || '0');

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid card number' };
  }

  return { isValid: true };
}

/**
 * Required field validation
 */
export function validateRequired(value: any, fieldName: string = 'Field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} must have at least one item` };
  }

  return { isValid: true };
}

/**
 * Number range validation
 */
export function validateNumberRange(
  value: number,
  min?: number,
  max?: number,
  fieldName: string = 'Value'
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (min !== undefined && value < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max}` };
  }

  return { isValid: true };
}

/**
 * String length validation
 */
export function validateLength(
  value: string,
  min?: number,
  max?: number,
  fieldName: string = 'Field'
): ValidationResult {
  if (typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} must be a string` };
  }

  if (min !== undefined && value.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters long` };
  }

  if (max !== undefined && value.length > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max} characters long` };
  }

  return { isValid: true };
}

/**
 * File validation
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    maxFiles?: number;
  } = {}
): ValidationResult {
  const { maxSize, allowedTypes } = options;

  if (!file) {
    return { isValid: false, error: 'File is required' };
  }

  if (maxSize && file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }

  return { isValid: true };
}

/**
 * Custom regex validation
 */
export function validateRegex(
  value: string,
  pattern: RegExp,
  errorMessage: string = 'Invalid format'
): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: 'Value is required' };
  }

  if (!pattern.test(value)) {
    return { isValid: false, error: errorMessage };
  }

  return { isValid: true };
}

/**
 * Validate multiple fields
 */
export function validateFields(
  fields: Record<string, any>,
  validators: Record<string, (value: any) => ValidationResult>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, validator] of Object.entries(validators)) {
    const value = fields[fieldName];
    const result = validator(value);

    if (!result.isValid) {
      errors[fieldName] = result.error || 'Invalid value';
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Async validation wrapper
 */
export async function validateAsync<T>(
  value: T,
  validator: (value: T) => Promise<ValidationResult>
): Promise<ValidationResult> {
  try {
    return await validator(value);
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    };
  }
}
