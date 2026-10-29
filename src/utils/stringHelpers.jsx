// "John Smith" to "JS"
export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

// "ARVILEN A. DE GUZMAN" to "ARVILEN D.", "John Smith" to "John S."
// The surname starts after the middle initial (e.g. "A."), or is the last word when there is none.
export function getShortName(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length < 2) return words[0] ?? ''

  const middleIndex = words.findIndex((word, i) => i > 0 && /^[A-Za-z]\.$/.test(word))
  const surname = middleIndex !== -1 && words[middleIndex + 1] ? words[middleIndex + 1] : words[words.length - 1]
  return `${words[0]} ${surname[0].toUpperCase()}.`
}
