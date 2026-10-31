import { useEffect, useState } from 'react'
import { Copy, ExternalLink, Link2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Modal from '../ui/Modal'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import ConfirmModal from '../ui/ConfirmModal'
import Skeleton from '../ui/Skeleton'
import useRequest from '../../hooks/useRequest'
import { createFormLink, formLinkUrl, getFormSummary, removeFormLink } from '../../services/formService'

// Public answer link of a form: create it, copy / open it, or turn it off.
// Anyone with the link can answer the form without signing in.
function ShareLinkModal({ formItem, onClose }) {
  const [code, setCode] = useState(undefined) // undefined: loading, null: no link
  const [loadError, setLoadError] = useState('')
  const [confirmOff, setConfirmOff] = useState(false)
  const create = useRequest(async () => setCode((await createFormLink(formItem.id)).code))
  const turnOff = useRequest(async () => {
    await removeFormLink(formItem.id)
    setCode(null)
    setConfirmOff(false)
    toast.success('Link turned off')
  })

  useEffect(() => {
    let ignore = false
    getFormSummary(formItem.id)
      .then((summary) => !ignore && setCode(summary.code))
      .catch((error) => !ignore && setLoadError(error.message))
    return () => {
      ignore = true
    }
  }, [formItem.id])

  const url = code ? formLinkUrl(code) : ''
  const copy = () =>
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error('Could not copy. Please select the link and copy it.'))

  return (
    <>
      <Modal title={`Answer link · ${formItem.title}`} onClose={onClose}>
        <Alert>{loadError || create.error || turnOff.error}</Alert>
        {code === undefined && !loadError && <Skeleton className="h-24 rounded-lg" />}

        {code === null && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Link2 size={32} className="text-gray-300" />
            <p className="text-sm text-gray-600">
              Create a link so students can answer this form online, without signing in.
            </p>
            <Button fullWidth={false} loading={create.loading} onClick={create.run}>
              Create link
            </Button>
          </div>
        )}

        {code && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Anyone with this link can answer the form. Answers show in Responses.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                value={url}
                aria-label="Answer link"
                onFocus={(e) => e.target.select()}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-page px-3 py-2 text-sm text-gray-700"
              />
              <Button fullWidth={false} onClick={copy}>
                <Copy size={16} />
                Copy
              </Button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ExternalLink size={16} />
                Open
              </a>
            </div>
            <div className="flex justify-end border-t border-gray-100 pt-4">
              <Button variant="danger" fullWidth={false} onClick={() => setConfirmOff(true)}>
                Turn off link
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {confirmOff && (
        <ConfirmModal
          title="Turn off link?"
          message="The link will stop working. Answers already received are kept. A new link can be created later."
          confirmLabel="Turn off"
          loading={turnOff.loading}
          onConfirm={turnOff.run}
          onClose={() => setConfirmOff(false)}
        />
      )}
    </>
  )
}

export default ShareLinkModal
