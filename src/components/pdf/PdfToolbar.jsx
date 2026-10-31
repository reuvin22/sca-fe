import { useRef } from 'react'
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowDownToLine,
  ArrowUpToLine,
  BringToFront,
  Lock,
  LockOpen,
  SendToBack,
  Bold,
  Circle,
  Copy,
  Eraser,
  Highlighter,
  ImagePlus,
  Italic,
  Minus,
  MousePointer2,
  PenLine,
  Pilcrow,
  Redo2,
  Square,
  Trash2,
  Type,
  Underline,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { FONTS, FONT_SIZES } from '../../utils/pdfEditorHelpers'

const TOOLS = [
  { value: 'select', label: 'Select / move', icon: MousePointer2 },
  { value: 'text', label: 'Text (one line)', icon: Type },
  { value: 'paragraph', label: 'Paragraph (wraps)', icon: Pilcrow },
  { value: 'pen', label: 'Pen / signature', icon: PenLine },
  { value: 'highlighter', label: 'Highlighter', icon: Highlighter },
  { value: 'rect', label: 'Rectangle', icon: Square },
  { value: 'ellipse', label: 'Ellipse', icon: Circle },
  { value: 'line', label: 'Line', icon: Minus },
  { value: 'whiteout', label: 'Whiteout (cover text)', icon: Eraser },
]

const iconButton = (on) =>
  `flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-30 ${
    on ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`
// Layer order of the selected object, like Word's "Bring to front" / "Send behind text"
const LAYERS = [
  { where: 'front', label: 'Bring to front', icon: BringToFront },
  { where: 'forward', label: 'Bring forward', icon: ArrowUpToLine },
  { where: 'backward', label: 'Send backward', icon: ArrowDownToLine },
  { where: 'back', label: 'Send to back (behind text)', icon: SendToBack },
]

// Align the selected object to the page
const ALIGN = [
  { where: 'left', label: 'Align to page left', icon: AlignStartVertical },
  { where: 'center', label: 'Center on page (horizontally)', icon: AlignCenterVertical },
  { where: 'right', label: 'Align to page right', icon: AlignEndVertical },
  { where: 'top', label: 'Align to page top', icon: AlignStartHorizontal },
  { where: 'middle', label: 'Center on page (vertically)', icon: AlignCenterHorizontal },
  { where: 'bottom', label: 'Align to page bottom', icon: AlignEndHorizontal },
]

const select = 'h-9 cursor-pointer rounded-lg border border-gray-200 bg-surface px-2 text-sm text-gray-700'
const divider = <span className="mx-1 h-6 w-px shrink-0 bg-gray-200" />

function ColorInput({ label, value, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-500" title={label}>
      {label}
      <input
        type="color"
        value={value.slice(0, 7)}
        onChange={(e) => onChange(e.target.value)}
        className="size-7 cursor-pointer rounded border border-gray-200 bg-transparent p-0.5"
      />
    </label>
  )
}

// Tools (top row) and the settings of the chosen tool or selected object (second row)
function PdfToolbar({ editor }) {
  const imageInput = useRef(null)
  const { tool, style, changeStyle, selected } = editor
  const locked = Boolean(selected?.lockMovementX)
  const isText = tool === 'text' || tool === 'paragraph' || selected?.type === 'i-text' || selected?.type === 'textbox'
  const isPen = tool === 'pen'
  const isShape =
    !isText && !isPen && (['rect', 'ellipse', 'line'].includes(tool) || (selected && selected.type !== 'image'))
  const hasFill = isShape && tool !== 'line' && selected?.type !== 'line' && selected?.type !== 'path'

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1">
        {TOOLS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={tool === value}
            onClick={() => editor.setTool(value)}
            className={iconButton(tool === value)}
          >
            <Icon size={18} />
          </button>
        ))}
        <button
          type="button"
          title="Add image"
          aria-label="Add image"
          onClick={() => imageInput.current.click()}
          className={iconButton(false)}
        >
          <ImagePlus size={18} />
        </button>
        <input
          ref={imageInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) editor.addImage(e.target.files[0])
            e.target.value = ''
          }}
        />
        {divider}
        <button
          type="button"
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
          disabled={!editor.canUndo}
          onClick={editor.undo}
          className={iconButton(false)}
        >
          <Undo2 size={18} />
        </button>
        <button
          type="button"
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
          disabled={!editor.canRedo}
          onClick={editor.redo}
          className={iconButton(false)}
        >
          <Redo2 size={18} />
        </button>
        {divider}
        <button
          type="button"
          title="Duplicate"
          aria-label="Duplicate"
          disabled={!selected}
          onClick={editor.duplicateSelected}
          className={iconButton(false)}
        >
          <Copy size={18} />
        </button>
        {LAYERS.map(({ where, label, icon: Icon }) => (
          <button
            key={where}
            type="button"
            title={label}
            aria-label={label}
            disabled={!selected}
            onClick={() => editor.moveLayer(where)}
            className={iconButton(false)}
          >
            <Icon size={18} />
          </button>
        ))}
        <button
          type="button"
          title={locked ? 'Unlock (can move again)' : 'Lock in place'}
          aria-label={locked ? 'Unlock' : 'Lock in place'}
          aria-pressed={locked}
          disabled={!selected}
          onClick={editor.toggleLock}
          className={iconButton(locked)}
        >
          {locked ? <Lock size={18} /> : <LockOpen size={18} />}
        </button>
        <button
          type="button"
          title="Delete (Del)"
          aria-label="Delete selected"
          disabled={!selected}
          onClick={editor.deleteSelected}
          className={iconButton(false)}
        >
          <Trash2 size={18} />
        </button>
        {divider}
        {ALIGN.map(({ where, label, icon: Icon }) => (
          <button
            key={where}
            type="button"
            title={label}
            aria-label={label}
            disabled={!selected}
            onClick={() => editor.alignSelected(where)}
            className={iconButton(false)}
          >
            <Icon size={18} />
          </button>
        ))}
        {divider}
        <button
          type="button"
          title="Zoom out"
          aria-label="Zoom out"
          disabled={editor.zoom <= 0.5}
          onClick={() => editor.setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
          className={iconButton(false)}
        >
          <ZoomOut size={18} />
        </button>
        <span className="w-12 text-center text-xs text-gray-600">{Math.round(editor.zoom * 100)}%</span>
        <button
          type="button"
          title="Zoom in"
          aria-label="Zoom in"
          disabled={editor.zoom >= 3}
          onClick={() => editor.setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
          className={iconButton(false)}
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Settings for the current tool or the selected object */}
      <div className="flex min-h-9 flex-wrap items-center gap-2 border-t border-gray-100 pt-2">
        {isText && (
          <>
            <select
              aria-label="Font"
              value={style.fontFamily}
              onChange={(e) => changeStyle({ fontFamily: e.target.value })}
              className={select}
            >
              {FONTS.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Font size"
              value={String(style.fontSize)}
              onChange={(e) => changeStyle({ fontSize: Number(e.target.value) })}
              className={select}
            >
              {FONT_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            <ColorInput label="Color" value={style.textColor} onChange={(textColor) => changeStyle({ textColor })} />
            <button
              type="button"
              title="Bold"
              aria-pressed={style.bold}
              onClick={() => changeStyle({ bold: !style.bold })}
              className={iconButton(style.bold)}
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              title="Italic"
              aria-pressed={style.italic}
              onClick={() => changeStyle({ italic: !style.italic })}
              className={iconButton(style.italic)}
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              title="Underline"
              aria-pressed={style.underline}
              onClick={() => changeStyle({ underline: !style.underline })}
              className={iconButton(style.underline)}
            >
              <Underline size={16} />
            </button>
            {[
              ['left', AlignLeft],
              ['center', AlignCenter],
              ['right', AlignRight],
              // justify-left: full lines fill the width, the last line stays left
              ['justify-left', AlignJustify],
            ].map(([align, Icon]) => (
              <button
                key={align}
                type="button"
                title={align === 'justify-left' ? 'Justify' : `Align ${align}`}
                aria-pressed={style.align === align}
                onClick={() => changeStyle({ align })}
                className={iconButton(style.align === align)}
              >
                <Icon size={16} />
              </button>
            ))}
          </>
        )}

        {isPen && (
          <>
            <ColorInput label="Pen" value={style.penColor} onChange={(penColor) => changeStyle({ penColor })} />
            <label className="flex items-center gap-2 text-xs text-gray-500">
              Size
              <input
                type="range"
                min="1"
                max="12"
                value={style.penWidth}
                onChange={(e) => changeStyle({ penWidth: Number(e.target.value) })}
                className="w-24 cursor-pointer accent-brand-600"
              />
            </label>
          </>
        )}

        {isShape && (
          <>
            <ColorInput label="Border" value={style.stroke} onChange={(stroke) => changeStyle({ stroke })} />
            {hasFill && (
              <>
                <ColorInput label="Fill" value={style.fill} onChange={(fill) => changeStyle({ fill })} />
                <button
                  type="button"
                  onClick={() => changeStyle({ fill: '#ffffff00' })}
                  className="cursor-pointer rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                >
                  No fill
                </button>
              </>
            )}
            <label className="flex items-center gap-2 text-xs text-gray-500">
              Border size
              <input
                type="range"
                min="0"
                max="12"
                value={style.strokeWidth}
                onChange={(e) => changeStyle({ strokeWidth: Number(e.target.value) })}
                className="w-24 cursor-pointer accent-brand-600"
              />
            </label>
          </>
        )}

        {(isText || isShape || selected?.type === 'image') && (
          <label className="flex items-center gap-2 text-xs text-gray-500">
            Opacity
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={style.opacity}
              onChange={(e) => changeStyle({ opacity: Number(e.target.value) })}
              className="w-24 cursor-pointer accent-brand-600"
            />
          </label>
        )}

        {!isText && !isPen && !isShape && selected?.type !== 'image' && (
          <p className="text-xs text-gray-500">
            {tool === 'whiteout'
              ? 'Drag over text to cover it with white.'
              : tool === 'highlighter'
                ? 'Drag over text to highlight it.'
                : 'Pick a tool, then click or drag on a page. Select an object to change it.'}
          </p>
        )}
      </div>
    </div>
  )
}

export default PdfToolbar
