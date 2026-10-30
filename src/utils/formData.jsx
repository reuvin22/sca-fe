// multipart/form-data body: text fields plus files under one field name (e.g. "media")
export function toFormData(fields, files = [], fileField = 'media') {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, value)
  })
  files.forEach((file) => form.append(fileField, file))
  return form
}

// Big uploads (videos) can take longer than normal requests
export const UPLOAD_TIMEOUT = 300000 // 5 minutes
