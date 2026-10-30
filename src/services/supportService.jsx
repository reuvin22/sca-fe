import api from '../api/axios'
import { SUPPORT_ROUTE } from '../api/routes'

// `request`: { type: 'bug' | 'feature', subject, description, severity? }
// `severity` ('low' | 'medium' | 'high' | 'critical') is only sent for bugs
export async function sendSupportRequest(request) {
  return (await api.post(SUPPORT_ROUTE, request)).data
}
