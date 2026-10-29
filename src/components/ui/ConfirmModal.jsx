import Modal from './Modal'
import Button from './Button'

function ConfirmModal({ title = 'Are you sure?', message, confirmLabel = 'Delete', loading, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose} className="max-w-sm">
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" fullWidth={false} onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" fullWidth={false} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
