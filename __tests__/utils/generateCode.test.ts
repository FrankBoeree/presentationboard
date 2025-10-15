import { generateBoardCode, isValidBoardCode } from '@/utils/generateCode'

describe('generateBoardCode', () => {
  it('should generate a 6-character code', () => {
    const code = generateBoardCode()
    expect(code).toHaveLength(6)
  })

  it('should only contain valid characters (A-Z, 2-9)', () => {
    const code = generateBoardCode()
    expect(code).toMatch(/^[A-Z2-9]{6}$/)
  })

  it('should not contain invalid characters (0, 1, O, I)', () => {
    const code = generateBoardCode()
    expect(code).not.toMatch(/[01OI]/)
  })

  it('should generate different codes on multiple calls', () => {
    const codes = new Set()
    for (let i = 0; i < 100; i++) {
      codes.add(generateBoardCode())
    }
    // Very unlikely to have duplicates in 100 calls
    expect(codes.size).toBeGreaterThan(90)
  })
})

describe('isValidBoardCode', () => {
  it('should validate correct codes', () => {
    expect(isValidBoardCode('ABC123')).toBe(true)
    expect(isValidBoardCode('XYZ789')).toBe(true)
    expect(isValidBoardCode('A2B3C4')).toBe(true)
  })

  it('should reject invalid codes', () => {
    expect(isValidBoardCode('ABC1234')).toBe(false) // Too long
    expect(isValidBoardCode('ABC12')).toBe(false) // Too short
    expect(isValidBoardCode('ABC123')).toBe(true) // Correct length
    expect(isValidBoardCode('abc123')).toBe(false) // Lowercase
    expect(isValidBoardCode('ABC01O')).toBe(false) // Contains 0, 1, O
    expect(isValidBoardCode('ABC12I')).toBe(false) // Contains I
  })

  it('should handle edge cases', () => {
    expect(isValidBoardCode('')).toBe(false)
    expect(isValidBoardCode(' ')).toBe(false)
    expect(isValidBoardCode('ABC-12')).toBe(false) // Contains dash
  })
})
