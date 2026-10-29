// Mock API. Replace with a real axios call when the backend is ready.
import { delay } from '../utils/mockApi'

// `request`: { type: 'bug' | 'feature', subject, description, severity? }
// `severity` ('low' | 'medium' | 'high' | 'critical') is only sent for bugs
export async function sendSupportRequest(request) {
  await delay()
  return { ...request, id: crypto.randomUUID() }
}
