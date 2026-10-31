import api from '../api/axios'
import { FORMS_ROUTE, PUBLIC_FORMS_ROUTE } from '../api/routes'
import { createListService, fetchPage } from '../utils/apiHelpers'

// { list, listAll, get, create, update, remove }
export const formService = createListService(FORMS_ROUTE)

// { code (public link code or null), exports: { pdf, word }, responseCount }
export async function getFormSummary(id) {
  return (await api.get(`${FORMS_ROUTE}/${id}/summary`)).data
}

// Turns the public answer link on. Returns { code }.
export async function createFormLink(id) {
  return (await api.post(`${FORMS_ROUTE}/${id}/link`)).data
}

export const removeFormLink = (id) => api.delete(`${FORMS_ROUTE}/${id}/link`)

// Counts a PDF / Word download of a saved form
export const recordFormExport = (id, format) => api.post(`${FORMS_ROUTE}/${id}/exports`, { format })

// Answers from the public link, newest first: { items: [{ id, submittedAt, answers }], pagination }
export const listFormResponses = (id, page) => fetchPage(`${FORMS_ROUTE}/${id}/responses`, {}, page)

// Public link (no sign-in): the form to answer, and sending the answers
export async function getPublicForm(code) {
  return (await api.get(`${PUBLIC_FORMS_ROUTE}/${code}`)).data
}

export async function submitFormAnswers(code, answers) {
  return (await api.post(`${PUBLIC_FORMS_ROUTE}/${code}/responses`, { answers })).data
}

// Full address of a public answer link
export const formLinkUrl = (code) => `${window.location.origin}/f/${code}`
