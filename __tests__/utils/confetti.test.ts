import { containsProfanity, RateLimiter } from '@/utils/confetti'

describe('containsProfanity', () => {
  it('should detect profanity in text', () => {
    expect(containsProfanity('This is spam content')).toBe(true)
    expect(containsProfanity('SPAM message')).toBe(true)
    expect(containsProfanity('test message')).toBe(true)
    expect(containsProfanity('lorem ipsum text')).toBe(true)
  })

  it('should not detect profanity in clean text', () => {
    expect(containsProfanity('This is a normal message')).toBe(false)
    expect(containsProfanity('Hello world')).toBe(false)
    expect(containsProfanity('Product launch Q&A')).toBe(false)
  })

  it('should be case insensitive', () => {
    expect(containsProfanity('SPAM')).toBe(true)
    expect(containsProfanity('spam')).toBe(true)
    expect(containsProfanity('SpAm')).toBe(true)
  })
})

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter

  beforeEach(() => {
    rateLimiter = new RateLimiter(1000) // 1 second for testing
  })

  it('should allow action initially', () => {
    expect(rateLimiter.canPerformAction()).toBe(true)
  })

  it('should prevent action after recording', () => {
    rateLimiter.recordAction()
    expect(rateLimiter.canPerformAction()).toBe(false)
  })

  it('should allow action after time interval', (done) => {
    rateLimiter.recordAction()
    expect(rateLimiter.canPerformAction()).toBe(false)
    
    setTimeout(() => {
      expect(rateLimiter.canPerformAction()).toBe(true)
      done()
    }, 1100) // Slightly more than 1 second
  })

  it('should calculate time until next action correctly', () => {
    rateLimiter.recordAction()
    const timeLeft = rateLimiter.getTimeUntilNextAction()
    expect(timeLeft).toBeGreaterThan(0)
    expect(timeLeft).toBeLessThanOrEqual(1000)
  })

  it('should return 0 when action is allowed', () => {
    expect(rateLimiter.getTimeUntilNextAction()).toBe(0)
  })

  it('should use default interval of 10 seconds', () => {
    const defaultRateLimiter = new RateLimiter()
    defaultRateLimiter.recordAction()
    const timeLeft = defaultRateLimiter.getTimeUntilNextAction()
    expect(timeLeft).toBeGreaterThan(9000) // Should be close to 10 seconds
  })
})
