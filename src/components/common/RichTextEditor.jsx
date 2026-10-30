import { Suspense, lazy, useState } from 'react'
import { useSelector } from 'react-redux'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Smile,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react'
import { RICH_TEXT } from '../../utils/styles'

// The emoji picker is large, so it loads only when first opened
const EmojiPicker = lazy(() => import('emoji-picker-react'))

const TOOL = 'cursor-pointer rounded-md p-1.5 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40'
const ACTIVE = 'bg-brand-100 text-brand-700'

// Word-style editor: headings, bold/italic/underline/strike, lists, quote, alignment, links, emoji.
// `onChange(html)` gets the content as HTML (the backend cleans it before saving).
function RichTextEditor({ value = '', onChange, placeholder = 'Write here…', disabled }) {
  const theme = useSelector((state) => state.ui.theme)
  const [emojiOpen, setEmojiOpen] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false } }), TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: value,
    editable: !disabled,
    shouldRerenderOnTransaction: true, // keeps the toolbar's active buttons in sync
    editorProps: {
      attributes: { class: `${RICH_TEXT} min-h-48 px-4 py-3 outline-none`, 'aria-label': placeholder },
    },
    onUpdate: ({ editor: current }) => onChange(current.isEmpty ? '' : current.getHTML()),
  })

  if (!editor) return null

  const chain = () => editor.chain().focus()

  const setLink = () => {
    const previous = editor.getAttributes('link').href ?? ''
    const url = window.prompt('Link address (https://…)', previous)
    if (url === null) return
    if (url === '') return chain().unsetLink().run()
    chain().extendMarkRange('link').setLink({ href: url }).run()
  }

  // [label, icon, isActive, action]
  const groups = [
    [
      ['Undo', Undo2, false, () => chain().undo().run(), !editor.can().undo()],
      ['Redo', Redo2, false, () => chain().redo().run(), !editor.can().redo()],
    ],
    [
      ['Heading 1', Heading1, editor.isActive('heading', { level: 1 }), () => chain().toggleHeading({ level: 1 }).run()],
      ['Heading 2', Heading2, editor.isActive('heading', { level: 2 }), () => chain().toggleHeading({ level: 2 }).run()],
    ],
    [
      ['Bold', Bold, editor.isActive('bold'), () => chain().toggleBold().run()],
      ['Italic', Italic, editor.isActive('italic'), () => chain().toggleItalic().run()],
      ['Underline', Underline, editor.isActive('underline'), () => chain().toggleUnderline().run()],
      ['Strikethrough', Strikethrough, editor.isActive('strike'), () => chain().toggleStrike().run()],
    ],
    [
      ['Bullet list', List, editor.isActive('bulletList'), () => chain().toggleBulletList().run()],
      ['Numbered list', ListOrdered, editor.isActive('orderedList'), () => chain().toggleOrderedList().run()],
      ['Quote', Quote, editor.isActive('blockquote'), () => chain().toggleBlockquote().run()],
    ],
    [
      ['Align left', AlignLeft, editor.isActive({ textAlign: 'left' }), () => chain().setTextAlign('left').run()],
      ['Align center', AlignCenter, editor.isActive({ textAlign: 'center' }), () => chain().setTextAlign('center').run()],
      ['Align right', AlignRight, editor.isActive({ textAlign: 'right' }), () => chain().setTextAlign('right').run()],
      ['Justify', AlignJustify, editor.isActive({ textAlign: 'justify' }), () => chain().setTextAlign('justify').run()],
    ],
    [['Link', Link, editor.isActive('link'), setLink]],
  ]

  return (
    <div className="relative rounded-lg border border-gray-300 bg-surface focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-2 py-1.5" role="toolbar" aria-label="Formatting">
        {groups.map((group, i) => (
          <div key={i} className="flex items-center gap-0.5 border-r border-gray-200 pr-1 last:border-r-0">
            {group.map(([label, Icon, active, action, toolDisabled]) => (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={active}
                disabled={disabled || toolDisabled}
                onClick={action}
                className={`${TOOL} ${active ? ACTIVE : ''}`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        ))}
        <button type="button" title="Emoji" aria-label="Emoji" disabled={disabled} onClick={() => setEmojiOpen((open) => !open)} className={`${TOOL} ${emojiOpen ? ACTIVE : ''}`}>
          <Smile size={16} />
        </button>
      </div>

      {emojiOpen && (
        <div className="absolute top-12 right-2 z-30">
          <Suspense fallback={<div className="rounded-lg bg-surface p-4 text-sm text-gray-500 shadow-lg">Loading emojis…</div>}>
            <EmojiPicker
              theme={theme === 'dark' ? 'dark' : 'light'}
              lazyLoadEmojis
              onEmojiClick={(emoji) => {
                chain().insertContent(emoji.emoji).run()
                setEmojiOpen(false)
              }}
            />
          </Suspense>
        </div>
      )}

      {/* The placeholder sits on the writing area, so it stays in place when the toolbar wraps */}
      <div className="relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && <p className="pointer-events-none absolute top-3 left-4 text-sm text-gray-400">{placeholder}</p>}
      </div>
    </div>
  )
}

export default RichTextEditor
