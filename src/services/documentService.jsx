import api from '../api/axios'
import { DOCUMENTS_ROUTE } from '../api/routes'
import { fetchAllPages, fetchPage } from '../utils/apiHelpers'

const UPLOAD_TIMEOUT = 120000 // documents with pictures can take longer than normal requests

// The upload: name, draft flag, the editable project (JSON) and, for a new document, the original PDF
function toFormData({ name, draft, project, source }) {
  const form = new FormData()
  form.append('name', name)
  form.append('draft', String(Boolean(draft)))
  form.append('project', new Blob([JSON.stringify(project)], { type: 'application/json' }), 'project.json')
  if (source) form.append('source', new Blob([source], { type: 'application/pdf' }), 'source.pdf')
  return form
}

// Document Storage (PDFs made in the PDF editor). Used by usePaginatedList: { list, listAll, remove }.
export const documentService = {
  tags: ['documents'],
  list: (filters, page) => fetchPage(DOCUMENTS_ROUTE, filters, page),
  listAll: (filters) => fetchAllPages(DOCUMENTS_ROUTE, filters),
  remove: (id) => api.delete(`${DOCUMENTS_ROUTE}/${id}`),
}

// { id, name, draft, pageCount, hasSource, updatedAt, project }
export async function getDocument(id) {
  return (await api.get(`${DOCUMENTS_ROUTE}/${id}`)).data
}

// The original PDF the document was made from, as bytes
export async function getDocumentSource(id) {
  const blob = await api.get(`${DOCUMENTS_ROUTE}/${id}/source`, { responseType: 'blob', timeout: UPLOAD_TIMEOUT })
  return new Uint8Array(await blob.arrayBuffer())
}

export async function createDocument(input) {
  return (await api.post(DOCUMENTS_ROUTE, toFormData(input), { timeout: UPLOAD_TIMEOUT })).data
}

export async function updateDocument(id, input) {
  return (await api.put(`${DOCUMENTS_ROUTE}/${id}`, toFormData(input), { timeout: UPLOAD_TIMEOUT })).data
}
