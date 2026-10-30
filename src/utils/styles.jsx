// Field text: always black in light mode and white in dark mode (never a theme or palette color)
export const FIELD_TEXT = 'text-black [[data-theme=dark]_&]:text-white'

// Same, for placeholder text that should read like a value (e.g. the current choice while searching)
export const FIELD_TEXT_PLACEHOLDER = 'placeholder:text-black [[data-theme=dark]_&]:placeholder:text-white'

// Formatted text from the rich text editor (headings, lists, quotes, links), used by the editor
// and the published update page so both look the same
export const RICH_TEXT = [
  'text-sm leading-relaxed text-gray-800 break-words',
  '[&_p]:my-2 [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold',
  '[&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_li]:my-1 [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600',
  '[&_a]:text-brand-600 [&_a]:underline [&_hr]:my-4 [&_hr]:border-gray-200 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1',
].join(' ')

// Shared style for Input and Select fields.
export const fieldClass = (error) =>
  `w-full rounded-lg border bg-surface px-3 py-2 text-sm ${FIELD_TEXT} placeholder:text-gray-400 outline-none focus:ring-1 ${
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
  }`
