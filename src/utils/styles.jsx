// Field text: always black in light mode and white in dark mode (never a theme or palette color)
export const FIELD_TEXT = 'text-black [[data-theme=dark]_&]:text-white'

// Same, for placeholder text that should read like a value (e.g. the current choice while searching)
export const FIELD_TEXT_PLACEHOLDER = 'placeholder:text-black [[data-theme=dark]_&]:placeholder:text-white'

// Shared style for Input and Select fields.
export const fieldClass = (error) =>
  `w-full rounded-lg border bg-surface px-3 py-2 text-sm ${FIELD_TEXT} placeholder:text-gray-400 outline-none focus:ring-1 ${
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
  }`
