export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  score: number // 0-4 (weak to strong)
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  let score = 0

  // Length check
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  } else {
    score += 1
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    score += 1
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    score += 1
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    score += 1
  }

  // Special character check
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)')
  } else {
    score += 1
  }

  // Common password check
  const commonPasswords = [
    'password', '123456', 'admin', 'qwerty', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'hello'
  ]
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password contains common words and is not secure')
    score = Math.max(0, score - 2)
  }

  // Sequential characters check
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters')
    score = Math.max(0, score - 1)
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.max(0, Math.min(4, score))
  }
}

export function getPasswordStrengthText(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'Very Weak'
    case 2:
      return 'Weak'
    case 3:
      return 'Good'
    case 4:
      return 'Strong'
    default:
      return 'Unknown'
  }
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'text-red-600'
    case 2:
      return 'text-orange-600'
    case 3:
      return 'text-yellow-600'
    case 4:
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
}
