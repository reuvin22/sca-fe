import CustomOptions from '../../components/settings/CustomOptions'

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage custom options used across the system.</p>
      </div>
      <CustomOptions />
    </div>
  )
}

export default SettingsPage
