// The form saved inside its own PDF / Word export, so importing that file restores it exactly.
// Stored as "sca-form:<base64 JSON>" in the file's properties (PDF keywords, Word custom property).
export const FORM_MARKER = 'sca-form:'

// Only the parts of the form the builder needs (no id or dates)
export function encodeForm({ title, description, header = [], questions = [] }) {
  const bytes = new TextEncoder().encode(JSON.stringify({ title, description, header, questions }))
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return FORM_MARKER + btoa(binary)
}

// Finds the marker anywhere in `text` and returns the form, or null when it is missing or broken
export function decodeForm(text) {
  const match = new RegExp(`${FORM_MARKER}([A-Za-z0-9+/=]+)`).exec(text)
  if (!match) return null
  try {
    const binary = atob(match[1])
    const json = new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
    return JSON.parse(json)
  } catch {
    return null
  }
}
