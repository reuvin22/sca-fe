import { useEffect, useMemo, useRef, useState } from 'react'
import { ImagePlus, Video, X } from 'lucide-react'
import Alert from '../ui/Alert'
import { formatSize } from '../../utils/fileHelpers'
import {
  ACCEPTED_MEDIA,
  MAX_MEDIA_FILES,
  MAX_MEDIA_TOTAL,
  getMediaKind,
  validateMediaFile,
} from '../../utils/mediaHelpers'

// Pick several images and videos with previews. `files` is a list of browser File objects.
function MediaPicker({ files, onChange, disabled }) {
  const inputRef = useRef(null)
  const [errors, setErrors] = useState([])

  // Temporary preview URLs, freed when the files change or the picker closes
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews])

  const handlePick = (e) => {
    const picked = [...e.target.files]
    e.target.value = '' // lets the same file be picked again
    const problems = picked.map(validateMediaFile).filter(Boolean)
    let next = [...files, ...picked.filter((file) => !validateMediaFile(file))]

    if (next.length > MAX_MEDIA_FILES) {
      problems.push(`You can add up to ${MAX_MEDIA_FILES} images or videos.`)
      next = next.slice(0, MAX_MEDIA_FILES)
    }
    if (next.reduce((sum, file) => sum + file.size, 0) > MAX_MEDIA_TOTAL) {
      problems.push(`All files together must be ${MAX_MEDIA_TOTAL / (1024 * 1024)} MB or smaller.`)
      return setErrors(problems)
    }
    setErrors(problems)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">Images & videos</span>
      {files.length > 0 && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="relative overflow-hidden rounded-lg border border-gray-200 bg-black">
              {getMediaKind(file.name) === 'video' ? (
                <video src={previews[i]} muted className="aspect-video w-full object-cover" />
              ) : (
                <img src={previews[i]} alt={file.name} className="aspect-video w-full object-cover" />
              )}
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-xs text-white">
                {getMediaKind(file.name) === 'video' && <Video size={12} className="mr-1 inline" />}
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, index) => index !== i))}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {files.length < MAX_MEDIA_FILES && (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          disabled={disabled}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImagePlus size={18} />
          Add images or videos
        </button>
      )}
      <p className="text-xs text-gray-400">Up to {MAX_MEDIA_FILES} files · images 10 MB · videos 50 MB each</p>
      <input ref={inputRef} type="file" multiple accept={ACCEPTED_MEDIA} onChange={handlePick} className="hidden" />
      {errors.length > 0 && (
        <Alert>
          {errors.map((message) => (
            <span key={message} className="block">
              {message}
            </span>
          ))}
        </Alert>
      )}
    </div>
  )
}

export default MediaPicker
