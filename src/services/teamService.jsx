import api from '../api/axios'
import { TEAM_ROUTE } from '../api/routes'

// Developers only. Team members are the developers reports can be assigned to: [{ id, name, email }]
export async function getTeam() {
  return (await api.get(TEAM_ROUTE)).data
}

// Emails a private link to the developer registration page
export async function inviteDeveloper(email) {
  return (await api.post(`${TEAM_ROUTE}/invitations`, { email })).data
}
