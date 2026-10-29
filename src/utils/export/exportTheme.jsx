// Shared colors (hex, no #) for the Excel and PDF exports.
export const THEME = {
  blue: '2F5597',
  border: 'BFC9D9',
  text: '1F2937',
  white: 'FFFFFF',
}

// Tones a column can return from `color(row)` to highlight a cell
export const TONES = {
  red: { fill: 'FDE2E2', text: 'B91C1C' },
  orange: { fill: 'FEF0C7', text: 'B45309' },
  sky: { fill: 'E0F2FE', text: '0369A1' },
  green: { fill: 'DCFCE7', text: '15803D' },
  gray: { fill: 'F3F4F6', text: '4B5563' },
}

export function saveFile(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
