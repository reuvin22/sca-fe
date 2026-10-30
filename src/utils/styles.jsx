// Shared style for Input and Select fields.
// gray-900 text is black in light mode and white in dark mode (see the theme in index.css).
export const fieldClass = (error) =>
  `w-full rounded-lg border bg-surface px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-1 ${
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
  }`
