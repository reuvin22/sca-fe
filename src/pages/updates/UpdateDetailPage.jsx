import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Megaphone } from 'lucide-react'
import Alert from '../../components/ui/Alert'
import Skeleton from '../../components/ui/Skeleton'
import MediaGallery from '../../components/common/MediaGallery'
import useFetch from '../../hooks/useFetch'
import { getUpdate, getUpdateMediaUrl, markUpdateRead } from '../../services/updateService'
import { formatDate, formatTime } from '../../utils/dateHelpers'
import { RICH_TEXT } from '../../utils/styles'

const TYPE_LABEL = { bug: 'Bug fix', feature: 'New feature' }

// A published system update. Opened from a notification (not in the menu).
function UpdateDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const loadUpdate = useCallback(() => getUpdate(id), [id])
  const { data: update, loading, error } = useFetch(loadUpdate)
  const loadMedia = useCallback((index) => getUpdateMediaUrl(id, index), [id])

  // Opening the update marks its notification as read
  useEffect(() => {
    markUpdateRead(id).catch(() => {})
  }, [id])

  const published = update && new Date(update.publishedAt)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button type="button" onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft size={16} />
        Back
      </button>

      <Alert>{error}</Alert>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-40" />
          <Skeleton className="h-64" />
        </div>
      )}

      {update && (
        <article className="space-y-6 rounded-xl bg-surface p-5 shadow-sm sm:p-8">
          <header className="space-y-3 border-b border-gray-100 pb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Megaphone size={14} />
              System update · {TYPE_LABEL[update.reportType]}
            </span>
            <h1 className="text-2xl font-bold wrap-break-word text-gray-900">{update.title}</h1>
            <p className="text-sm text-gray-500">
              By {update.authorName} · {formatDate(update.publishedAt.slice(0, 10))} at{' '}
              {formatTime(`${String(published.getHours()).padStart(2, '0')}:${String(published.getMinutes()).padStart(2, '0')}`)}
            </p>
          </header>

          {/* Cleaned on the server before saving (only formatting tags are kept) */}
          <div className={RICH_TEXT} dangerouslySetInnerHTML={{ __html: update.contentHtml }} />

          {update.media.length > 0 && (
            <section className="space-y-3 border-t border-gray-100 pt-5">
              <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Screenshots & videos</h2>
              <MediaGallery items={update.media} loadUrl={loadMedia} />
            </section>
          )}
        </article>
      )}
    </div>
  )
}

export default UpdateDetailPage
