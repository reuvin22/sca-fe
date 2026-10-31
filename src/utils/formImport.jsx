import { OPTION_TYPES, QUESTION_TYPES, VARIABLES, newQuestion } from './formBuilderHelpers'
import { decodeForm } from './formPayload'

// Import a form into the builder:
// - PDF / Word files exported from SCA Forms carry the form itself (see formPayload): restored exactly.
// - Other Word (.docx) forms are read line by line (best effort); the user reviews before saving.
// Returns { form, exact } or throws an Error with a friendly message.
export async function importFormFile(file) {
  const extension = file.name.split('.').pop().toLowerCase()

  if (extension === 'pdf') {
    const text = new TextDecoder('latin1').decode(await file.arrayBuffer())
    const form = decodeForm(text)
    if (!form)
      throw new Error('This PDF was not exported from SCA Forms. To import another form, use its Word (.docx) file.')
    return { form: cleanForm(form), exact: true }
  }

  if (extension === 'docx') {
    const { default: JSZip } = await import('jszip')
    const zip = await JSZip.loadAsync(file).catch(() => {
      throw new Error('This Word file could not be opened. Please check the file and try again.')
    })
    const custom = await zip.file('docProps/custom.xml')?.async('string')
    const saved = custom && decodeForm(custom)
    if (saved) return { form: cleanForm(saved), exact: true }

    const xml = await zip.file('word/document.xml')?.async('string')
    if (!xml) throw new Error('This Word file has no content to import.')
    const form = readWordForm(xml)
    if (!form.title && !form.header.length && !form.questions.length)
      throw new Error('No form fields were found in this file.')
    return { form, exact: false }
  }

  throw new Error('Choose a Word (.docx) or PDF file.')
}

const TYPES = QUESTION_TYPES.map((type) => type.value)

// New ids and only known answer types, so an imported form is safe to edit and save
function cleanForm(form) {
  const clean = (items = []) =>
    items.map((item) =>
      newQuestion({ ...item, id: crypto.randomUUID(), type: TYPES.includes(item.type) ? item.type : 'text' }),
    )
  return {
    title: String(form.title ?? ''),
    description: String(form.description ?? ''),
    header: clean(form.header),
    questions: clean(form.questions),
  }
}

// ---- Reading other Word forms ----

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
// Box / circle symbols Word uses for checkboxes and radio buttons (incl. Wingdings codes)
const SYMBOLS = { 2610: '☐', 2611: '☐', 2612: '☐', F0A8: '☐', F06F: '○', '25CB': '○', '25EF': '○' }
const MARKS = /[☐□■▢○◯●⚪]|\(\s?\)|\[\s?\]/
const ROUND_MARKS = /[○◯●⚪]|\(\s?\)/
const BLANK = /^[\s_.]+$/ // a line of underscores (a blank to write on)
const NUMBERED = /^\s*(\d{1,3})\s*[.)]\s*(.+)$/
const SECTION = /^(section|part)\s+[\w.]+\s*[:.\-–]/i

// Text of one paragraph: tabs become "\t", checkbox symbols become ☐ / ○
function paragraphText(paragraph) {
  let text = ''
  for (const node of paragraph.getElementsByTagNameNS(W, '*')) {
    if (node.localName === 't') text += node.textContent
    else if (node.localName === 'tab') text += '\t'
    else if (node.localName === 'br') text += ' '
    else if (node.localName === 'sym') text += SYMBOLS[(node.getAttributeNS(W, 'char') ?? '').toUpperCase()] ?? ''
  }
  return text
}

// Paragraph style (e.g. "Heading1") and whether Word numbers it automatically (numbered list)
function paragraphInfo(paragraph) {
  const style = paragraph.getElementsByTagNameNS(W, 'pStyle')[0]?.getAttributeNS(W, 'val') ?? ''
  return {
    heading: /^(heading|title|subtitle)/i.test(style),
    listed: paragraph.getElementsByTagNameNS(W, 'numPr').length > 0,
  }
}

// Document lines in reading order: { text, heading, listed }.
// A table row becomes one line with its cells separated by tabs.
function wordLines(xml) {
  const body = new DOMParser().parseFromString(xml, 'application/xml').getElementsByTagNameNS(W, 'body')[0]
  const lines = []
  const cellText = (cell) => [...cell.getElementsByTagNameNS(W, 'p')].map(paragraphText).join(' ')
  for (const node of body?.children ?? []) {
    if (node.localName === 'p') lines.push({ text: paragraphText(node), ...paragraphInfo(node) })
    if (node.localName === 'tbl') {
      for (const row of node.children) {
        if (row.localName !== 'tr') continue
        const cells = [...row.children].filter((cell) => cell.localName === 'tc')
        lines.push({ text: cells.map(cellText).join('\t'), heading: false, listed: false })
      }
    }
  }
  return lines.map((line) => ({ ...line, text: line.text.replace(/\u00a0/g, ' ').trim() }))
}

// Guesses the answer type from the label (e.g. "Date" → date picker)
function typeFor(label) {
  if (/\b(date|birthday|petsa)\b/i.test(label)) return 'date'
  if (/e-?mail/i.test(label)) return 'email'
  if (/\b(phone|contact|mobile|cellphone|tel)\b/i.test(label)) return 'tel'
  if (/^age$/i.test(label)) return 'number'
  return 'text'
}

// "Name" → the name variable, so answers can be matched to students later
function variableFor(label) {
  const plain = label
    .toLowerCase()
    .replace(/[^a-z& ]/g, '')
    .trim()
  if (/^(full |student |learner )?name( of (student|learner))?$/.test(plain)) return 'name'
  if (/^(grade|grade (and|&) section|section|year (and|&) section)$/.test(plain)) return 'section'
  return VARIABLES.find((item) => item.label.toLowerCase() === plain)?.variable ?? ''
}

// "NAME: ____ DATE: ____" → ['NAME', 'DATE']
function labelsIn(line) {
  return line
    .split(/\t|_{2,}|\s{3,}/)
    .flatMap((part) => [...part.matchAll(/([^:]{1,60}?):/g)].map((match) => match[1].trim()))
    .filter((label) => label && !BLANK.test(label))
}

// Choices after ☐ / ○ marks: "☐ Yes ☐ No" → ['Yes', 'No']
const markedChoices = (text) =>
  text
    .split(new RegExp(MARKS.source, 'g'))
    .map((part) => part.replace(/_{2,}/g, '').trim())
    .filter(Boolean)

// Lettered choices "A. Seoul  B. Tokyo  C. Bangkok" → { start, options }, letters must go A, B, C...
// `start` is where "A." begins (the question text is before it), or -1 when there are none.
function letteredChoices(text) {
  const found = []
  for (const match of text.matchAll(/(?:^|\s)\(?([A-Ha-h])[.)]\s+/g)) {
    const expected = String.fromCharCode((found.length ? found[0].letter.charCodeAt(0) : 0) + found.length)
    const letter = match[1]
    if (found.length ? letter === expected : /[Aa]/.test(letter)) {
      found.push({ letter, index: match.index, end: match.index + match[0].length })
    }
  }
  if (found.length < 2) return { start: -1, options: [] }
  const options = found.map((item, i) => text.slice(item.end, found[i + 1]?.index ?? text.length).trim())
  return { start: found[0].index, options: options.filter(Boolean) }
}

const isAllCaps = (text) => /[A-Z]{2}/.test(text) && text === text.toUpperCase()
const titleCase = (text) => text.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase())

function readWordForm(xml) {
  const form = { title: '', description: '', header: [], questions: [] }
  let last = null // the question that following choice / blank lines belong to
  let blanks = 0
  const hasQuestions = () => form.questions.some((item) => item.type !== 'section')

  const setChoices = (question, options, round) => {
    if (!options.length) return
    if (!OPTION_TYPES.includes(question.type)) question.type = round ? 'radio' : 'checkbox'
    // Several lines of choices: show them as a grid
    if (question.options.length) question.layout = 'grid'
    question.columns = Math.min(4, Math.max(2, question.columns, options.length))
    question.options.push(...options.filter((option) => !question.options.includes(option)))
  }

  // Question text, with choices on the same line ("... ○ Yes ○ No" or "... A. 45 B. 50")
  const addQuestion = (text) => {
    const lettered = letteredChoices(text)
    const mark = text.search(MARKS)
    const cut = [lettered.start, mark].filter((index) => index > 0)
    const label = (cut.length ? text.slice(0, Math.min(...cut)) : text)
      .replace(/_{2,}.*$/, '')
      .trim()
      .replace(/:$/, '')
    last = newQuestion({ label, type: typeFor(label) })
    blanks = 0
    form.questions.push(last)
    if (lettered.start > 0) setChoices(last, lettered.options, true)
    else if (mark > 0) setChoices(last, markedChoices(text.slice(mark)), ROUND_MARKS.test(text))
  }

  const addSection = (text) => {
    // A section before any field (e.g. "Section 1: Basic Information") just starts the header
    if (!form.header.length && !form.questions.length) return
    form.questions.push(newQuestion({ type: 'section', label: isAllCaps(text) ? titleCase(text) : text }))
    last = null
  }

  // "LABEL: ____" fields go in the header, sharing the row; "Department: ☐ IT ☐ HR" becomes choices
  const addHeaderFields = (text) => {
    const colon = text.indexOf(':')
    if (MARKS.test(text) && colon > 0 && colon < text.search(MARKS)) {
      const label = text.slice(0, colon).trim()
      const field = newQuestion({ label, width: 'full', variable: variableFor(label) })
      setChoices(field, markedChoices(text.slice(colon + 1)), ROUND_MARKS.test(text))
      form.header.push(field)
      return
    }
    const labels = labelsIn(text)
    const width = labels.length === 2 ? 'half' : labels.length === 3 ? 'third' : 'full'
    for (const label of labels) {
      const clean = isAllCaps(label) ? titleCase(label) : label
      form.header.push(newQuestion({ label: clean, type: typeFor(label), width, variable: variableFor(label) }))
    }
  }

  for (const { text, heading, listed } of wordLines(xml)) {
    if (!text) continue
    if (BLANK.test(text)) {
      // Lines to write on after a question: two or more make it a long answer
      if (last && ++blanks >= 2 && last.type === 'text') last.type = 'textarea'
      continue
    }
    if (!form.title) {
      form.title = text.replace(/\t+/g, ' ')
      continue
    }
    if (/^end of\b/i.test(text)) continue

    // Choices on their own line belong to the question above
    const lettered = letteredChoices(text)
    if (last && lettered.start === 0) {
      setChoices(last, lettered.options, true)
      continue
    }
    if (last && (MARKS.test(text[0]) || /^[([]\s?[)\]]/.test(text))) {
      setChoices(last, markedChoices(text), ROUND_MARKS.test(text))
      continue
    }

    if (heading || SECTION.test(text)) {
      addSection(text)
      continue
    }
    if (/^instructions?\s*:/i.test(text)) {
      form.description = [form.description, text.replace(/^instructions?\s*:\s*/i, '')].filter(Boolean).join(' ')
      continue
    }

    const numbered = NUMBERED.exec(text)
    if (numbered || listed) {
      addQuestion(numbered ? numbered[2] : text)
      continue
    }
    if (!hasQuestions() && text.includes(':') && (/_{2,}/.test(text) || MARKS.test(text) || text.length <= 60)) {
      addHeaderFields(text)
      continue
    }
    if (isAllCaps(text) && text.length <= 60 && !text.includes(':')) {
      addSection(text)
      continue
    }
    // Any other line after the header is a question; before it, the description
    if (form.header.length || form.questions.length || text.endsWith('?')) addQuestion(text)
    else form.description = [form.description, text].filter(Boolean).join(' ')
  }
  return form
}
