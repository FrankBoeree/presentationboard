/**
 * Generates a 6-character code using A-Z and 2-9 (excluding 0, 1, O, I for clarity)
 */
export function generateBoardCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'
  let result = ''
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Validates if a board code is in the correct format
 */
export function isValidBoardCode(code: string): boolean {
  return /^[A-Z2-9]{6}$/.test(code)
}
