import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Camera, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ConfirmModal from '../ui/ConfirmModal'
import Avatar from '../common/Avatar'
import useRequest from '../../hooks/useRequest'
import { deleteProfilePhoto, uploadProfilePhoto } from '../../services/authService'
import { setProfile } from '../../store/authSlice'
import { MAX_IMAGE_SIZE } from '../../utils/fileHelpers'

const PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const PHOTO_MAX_SIZE = MAX_IMAGE_SIZE // 10 MB, same as the backend

// Error message for a photo that can't be uploaded, or '' when it's fine
function validatePhoto(file) {
  if (!PHOTO_TYPES.includes(file.type)) return 'Please choose a PNG, JPG or WEBP image.'
  if (file.size > PHOTO_MAX_SIZE) return 'The photo must be 10 MB or smaller.'
  return ''
}

// Profile photo, name and role, with buttons to change or remove the photo
function ProfileHeader() {
  const dispatch = useDispatch()
  const { user, school } = useSelector((state) => state.auth)
  const inputRef = useRef(null)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const upload = useRequest(uploadProfilePhoto)
  const remove = useRequest(deleteProfilePhoto)
  const hasPhoto = Boolean(user.photoUpdatedAt)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = '' // lets the same file be picked again
    if (!file) return

    const error = validatePhoto(file)
    if (error) return toast.error(error)

    const profile = await upload.run(file)
    if (profile) {
      dispatch(setProfile(profile))
      toast.success('Profile photo updated')
    }
  }

  const handleRemove = async () => {
    const profile = await remove.run()
    if (profile) {
      dispatch(setProfile(profile))
      toast.success('Profile photo removed')
      setConfirmRemove(false)
    }
  }

  return (
    <Card>
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Avatar className="size-20 text-2xl" />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-semibold wrap-break-word text-gray-900">{user.fullName}</p>
          <p className="text-sm text-gray-500">
            {user.role} · {school.name}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <input ref={inputRef} type="file" accept={PHOTO_TYPES.join(',')} onChange={handleFile} className="hidden" />
            <Button variant="outline" fullWidth={false} loading={upload.loading} onClick={() => inputRef.current.click()}>
              {!upload.loading && <Camera size={16} />}
              {hasPhoto ? 'Change photo' : 'Upload photo'}
            </Button>
            {hasPhoto && (
              <Button variant="outline" fullWidth={false} onClick={() => setConfirmRemove(true)} disabled={upload.loading}>
                <Trash2 size={16} />
                Remove
              </Button>
            )}
          </div>
          {upload.error && <p className="mt-2 text-xs text-red-600">{upload.error}</p>}
        </div>
      </div>

      {confirmRemove && (
        <ConfirmModal
          message="Your profile photo will be removed."
          confirmLabel="Remove"
          loading={remove.loading}
          onConfirm={handleRemove}
          onClose={() => setConfirmRemove(false)}
        />
      )}
    </Card>
  )
}

export default ProfileHeader
