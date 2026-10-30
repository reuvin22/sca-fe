import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import ConfirmModal from '../ui/ConfirmModal'
import MediaPicker from '../common/MediaPicker'
import RichTextEditor from '../common/RichTextEditor'
import useRequest from '../../hooks/useRequest'
import { publishUpdate } from '../../services/updateService'
import { REPORT_TYPE } from '../../utils/reportBoardHelpers'

// Write the update for a done task: formatted text, emojis, images and videos.
// "This task is implemented" publishes it and notifies every other user.
function UpdateEditorModal({ task, onPublished, onClose }) {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState([])
  const [confirming, setConfirming] = useState(false)
  const publish = useRequest(publishUpdate)
  const isEmpty = !content && files.length === 0

  const handlePublish = async () => {
    const update = await publish.run(task.id, content, files)
    setConfirming(false)
    if (update) onPublished(update)
  }

  return (
    <Modal title="Write update" onClose={publish.loading ? () => {} : onClose} className="max-w-3xl">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge {...REPORT_TYPE[task.type]} />
          <p className="font-medium text-gray-900">{task.subject}</p>
        </div>

        <RichTextEditor value={content} onChange={setContent} placeholder="What changed? Users will see this in their notifications." disabled={publish.loading} />
        <MediaPicker files={files} onChange={setFiles} disabled={publish.loading} />
        <Alert>{publish.error}</Alert>

        <div className="flex justify-end gap-2">
          <Button variant="outline" fullWidth={false} onClick={onClose} disabled={publish.loading}>
            Cancel
          </Button>
          <Button fullWidth={false} onClick={() => setConfirming(true)} disabled={isEmpty} loading={publish.loading}>
            {!publish.loading && <BadgeCheck size={16} />}
            This task is implemented
          </Button>
        </div>
      </div>

      {confirming && (
        <ConfirmModal
          title="Publish this update?"
          message="Every user will get a notification about this update. You can't edit it after publishing."
          confirmLabel="Publish & notify"
          loading={publish.loading}
          onConfirm={handlePublish}
          onClose={() => setConfirming(false)}
        />
      )}
    </Modal>
  )
}

export default UpdateEditorModal
