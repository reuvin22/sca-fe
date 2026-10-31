import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Skeleton from '../ui/Skeleton'

// Images and videos in a neat, even grid. Click an image to see it full size.
// `items`: [{ index, name, kind: 'image' | 'video' }]. `loadUrl(index)` downloads one (needs the login token).
function MediaGallery({ items, loadUrl }) {
  const [urls, setUrls] = useState({}) // index -> temporary URL
  const [failed, setFailed] = useState(false)
  const [zoomed, setZoomed] = useState(null)

  // Downloads again only when the attachments themselves change, not when the parent passes
  // a new array with the same items (e.g. after changing a report's column), so nothing flashes
  const indexKey = items.map((item) => item.index).join(',')

  useEffect(() => {
    let cancelled = false
    const loaded = []
    const indexes = indexKey ? indexKey.split(',').map(Number) : []
    indexes.forEach((index) =>
      loadUrl(index)
        .then((url) => {
          if (cancelled) return URL.revokeObjectURL(url)
          loaded.push(url)
          setUrls((prev) => ({ ...prev, [index]: url }))
        })
        .catch(() => !cancelled && setFailed(true)),
    )
    return () => {
      cancelled = true
      loaded.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [indexKey, loadUrl])

  if (items.length === 0) return null

  // One item uses the full width; more items share an even grid
  const grid = items.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div className="space-y-2">
      <ul className={`grid gap-3 ${grid}`}>
        {items.map((item) => {
          const url = urls[item.index]
          return (
            <li key={item.index} className="overflow-hidden rounded-xl border border-gray-200 bg-black">
              {!url && <Skeleton className="aspect-video w-full rounded-none" />}
              {url && item.kind === 'video' && (
                <video
                  src={url}
                  controls
                  preload="metadata"
                  className="aspect-video w-full bg-black"
                  aria-label={item.name}
                />
              )}
              {url && item.kind === 'image' && (
                <button
                  type="button"
                  onClick={() => setZoomed({ url, name: item.name })}
                  className="block w-full cursor-zoom-in"
                >
                  <img src={url} alt={item.name} className="aspect-video w-full object-contain" />
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {failed && <p className="text-xs text-red-600">Some images or videos could not be loaded.</p>}

      {zoomed && (
        <Modal title={zoomed.name} onClose={() => setZoomed(null)} className="max-w-5xl">
          <img src={zoomed.url} alt={zoomed.name} className="mx-auto max-h-[75vh] w-auto object-contain" />
        </Modal>
      )}
    </div>
  )
}

export default MediaGallery
