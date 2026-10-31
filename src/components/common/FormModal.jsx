import { useState } from 'react'
import Modal from '../ui/Modal'
import ConfirmModal from '../ui/ConfirmModal'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import useRequest from '../../hooks/useRequest'

// Modal with a form and Delete / Close / Save buttons. Delete shows only when `onDelete` is passed.
// `submitLabel` overrides the default Add / Save text.
function FormModal({
  title,
  onSubmit,
  onClose,
  onDelete,
  deleteMessage,
  saving,
  error,
  className,
  submitLabel,
  children,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const remove = useRequest(onDelete)

  const handleDelete = async () => {
    if (await remove.run()) onClose()
  }

  return (
    <>
      <Modal title={title} onClose={onClose} className={className}>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Alert>{error || remove.error}</Alert>
          {children}

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {onDelete && (
              <Button
                type="button"
                variant="danger"
                fullWidth={false}
                className="mr-auto"
                onClick={() => setConfirmOpen(true)}
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" fullWidth={false} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" fullWidth={false} loading={saving}>
              {submitLabel ?? (onDelete ? 'Save' : 'Add')}
            </Button>
          </div>
        </form>
      </Modal>

      {confirmOpen && (
        <ConfirmModal
          title="Delete record?"
          message={deleteMessage}
          loading={remove.loading}
          onConfirm={handleDelete}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}

export default FormModal
