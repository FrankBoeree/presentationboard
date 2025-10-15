import { getDeviceId, resetDeviceId } from '@/utils/deviceId'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('getDeviceId', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a UUID when no device ID exists in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const deviceId = getDeviceId()
    
    expect(deviceId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('presentation-board-device-id', deviceId)
  })

  it('should return existing device ID from localStorage', () => {
    const existingId = 'existing-device-id'
    mockLocalStorage.getItem.mockReturnValue(existingId)
    
    const deviceId = getDeviceId()
    
    expect(deviceId).toBe(existingId)
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
  })

  it('should work in server-side environment', () => {
    // Mock window as undefined (server-side)
    const originalWindow = global.window
    // @ts-ignore
    delete global.window
    
    const deviceId = getDeviceId()
    
    expect(deviceId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    
    // Restore window
    global.window = originalWindow
  })
})

describe('resetDeviceId', () => {
  it('should remove device ID from localStorage', () => {
    resetDeviceId()
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('presentation-board-device-id')
  })

  it('should not throw error in server-side environment', () => {
    // Mock window as undefined (server-side)
    const originalWindow = global.window
    // @ts-ignore
    delete global.window
    
    expect(() => resetDeviceId()).not.toThrow()
    
    // Restore window
    global.window = originalWindow
  })
})
