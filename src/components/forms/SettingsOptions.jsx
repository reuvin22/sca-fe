import { useEffect } from 'react'
import AddInput from '../ui/AddInput'
import useAddSettingsOption from '../../hooks/useAddSettingsOption'

const same = (a, b) => a.length === b.length && a.every((item, i) => item === b[i])

// Choices of a question named like a Settings category (e.g. "Grade & Section"): they always come from
// Settings, so every form uses the same list. A missing value is added to Settings (and so to every
// dropdown using it). `options` are the question's current choices; `onChange(options)` keeps them in sync.
function SettingsOptions({ id, category, settingsOptions, options, onChange }) {
  const addOption = useAddSettingsOption()

  // Settings changed (here or on the Settings page): the question follows
  useEffect(() => {
    if (!same(settingsOptions, options)) onChange(settingsOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsOptions, options])

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        From Settings → <span className="font-medium text-gray-700">{category}</span>. Add a value here or in Settings
        and every form and dropdown gets it.
      </p>
      {settingsOptions.length ? (
        <ul className="flex flex-wrap gap-2">
          {settingsOptions.map((option) => (
            <li key={option} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {option}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">No values in Settings yet.</p>
      )}
      <AddInput
        id={id}
        items={settingsOptions}
        placeholder={`Add a ${category} value`}
        onAdd={(text) => addOption(category, text)}
      />
    </div>
  )
}

export default SettingsOptions
