import { v4 as uuidv4 } from 'uuid'

const DEVICE_ID_KEY = 'presentation-board-device-id'

/**
 * Gets or creates a device ID stored in localStorage
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') {
    return uuidv4()
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  
  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  
  return deviceId
}

/**
 * Resets the device ID (useful for testing)
 */
export function resetDeviceId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEVICE_ID_KEY)
  }
}
