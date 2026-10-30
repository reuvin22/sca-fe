import { useState } from 'react'
import AuthHeader from '../common/AuthHeader'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import TextLink from '../ui/TextLink'
import useRequest from '../../hooks/useRequest'
import { acceptInvitation } from '../../services/authService'

// Developer invitation for an email that already has an account: the role is only added
// when the account owner accepts here (opening the emailed link proves they own the email).
function AcceptInvitation({ token, email }) {
  const accept = useRequest(acceptInvitation)
  const [accepted, setAccepted] = useState(false)

  const handleAccept = async () => {
    if (await accept.run(token)) setAccepted(true)
  }

  if (accepted) {
    return (
      <>
        <AuthHeader title="You're on the team! 🎉" subtitle={`${email} now has the developer pages.`} />
        <p className="mb-4 text-center text-sm text-gray-500">
          Sign in again (or refresh if you're already signed in) to see them.
        </p>
        <div className="text-center">
          <TextLink to="/login">Go to sign in</TextLink>
        </div>
      </>
    )
  }

  return (
    <>
      <AuthHeader title="Join the developer team" subtitle={`You were invited with your account ${email}`} />
      <div className="space-y-4">
        <Alert>{accept.error}</Alert>
        <p className="text-sm text-gray-600">
          Accepting adds the developer pages to your account. You keep everything you have now.
        </p>
        <Button type="button" loading={accept.loading} onClick={handleAccept}>
          {accept.loading ? 'Accepting...' : 'Accept invitation'}
        </Button>
        <p className="text-center text-sm text-gray-500">
          Not you? <TextLink to="/login">Go to sign in</TextLink>
        </p>
      </div>
    </>
  )
}

export default AcceptInvitation
