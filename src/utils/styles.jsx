// Shared style for Input and Select fields.
export const fieldClass = (error) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-1 ${
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
  }`
