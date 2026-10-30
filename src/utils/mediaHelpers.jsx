// Image/video attachments (bug reports, system updates). Same limits as the backend.
const MB = 1024 * 1024
export const MAX_MEDIA_FILES = 6
export const MAX_MEDIA_TOTAL = 100 * MB
const LIMITS = { image: 10 * MB, video: 50 * MB }

const TYPES = {
  image: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
  video: ['mp4', 'webm', 'mov'],
}

// For the file picker, e.g. ".png,.jpg,...,.mp4"
export const ACCEPTED_MEDIA = [...TYPES.image, ...TYPES.video].map((ext) => `.${ext}`).join(',')

// 'image' | 'video' | null (not allowed)
export function getMediaKind(fileName) {
  const extension = fileName.split('.').pop().toLowerCase()
  return Object.keys(TYPES).find((kind) => TYPES[kind].includes(extension)) ?? null
}

// Error message for one file, or '' when it's fine
export function validateMediaFile(file) {
  const kind = getMediaKind(file.name)
  if (!kind) return `${file.name}: only images (PNG, JPG, WEBP, GIF) and videos (MP4, WEBM, MOV) are allowed.`
  if (file.size > LIMITS[kind]) return `${file.name}: ${kind}s must be ${LIMITS[kind] / MB} MB or smaller.`
  return ''
}
