import { useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas, Ellipse, FabricImage, IText, Line, PencilBrush, Rect, Textbox, util } from 'fabric'

const SHAPE_TOOLS = ['rect', 'ellipse', 'line', 'whiteout']
const SNAP_DISTANCE = 6 // screen pixels: closer than this snaps to a guide
const GUIDE_COLOR = '#ec4899'

// Where a moving object can line up: page edges and center, and the edges and centers of the other objects
function snapTargets(canvas, page, moving) {
  const xs = [0, page.width / 2, page.width]
  const ys = [0, page.height / 2, page.height]
  for (const object of canvas.getObjects()) {
    if (object === moving || !object.visible) continue
    const box = object.getBoundingRect()
    xs.push(box.left, box.left + box.width / 2, box.left + box.width)
    ys.push(box.top, box.top + box.height / 2, box.top + box.height)
  }
  return { xs, ys }
}

// Closest match between the object's three lines (start, middle, end) and the targets, or null
function closest(lines, targets, distance) {
  let best = null
  for (const line of lines) {
    for (const target of targets) {
      const delta = target - line
      if (Math.abs(delta) <= distance && (!best || Math.abs(delta) < Math.abs(best.delta))) best = { delta, at: target }
    }
  }
  return best
}
const HIGHLIGHT = 'rgba(250, 204, 21, 0.4)'
const topLeft = { originX: 'left', originY: 'top' }

// One PDF page: the page drawn underneath and a Fabric canvas on top for the edits.
// Object positions are in PDF points (the canvas zoom does the scaling).
function PdfPageCanvas({
  page,
  zoom,
  tool,
  style,
  active,
  onActivate,
  onRegister,
  onUnregister,
  onChange,
  onSelect,
  onToolDone,
}) {
  const element = useRef(null)
  const canvasRef = useRef(null)
  const drawing = useRef(null) // shape being drawn: { shape, x, y }
  const guides = useRef({ x: null, y: null }) // guide lines shown while moving (page points)
  // Latest props for the Fabric event handlers (registered once)
  const latest = useRef({})
  useLayoutEffect(() => {
    latest.current = { tool, style, onActivate, onChange, onSelect, onToolDone }
  })

  useEffect(() => {
    const canvas = new Canvas(element.current, {
      width: page.width * zoom,
      height: page.height * zoom,
      preserveObjectStacking: true,
    })
    canvas.setZoom(zoom)
    canvasRef.current = canvas
    if (page.image) {
      FabricImage.fromURL(page.image).then((image) => {
        image.set({ ...topLeft, scaleX: page.width / image.width, scaleY: page.height / image.height })
        canvas.backgroundImage = image
        canvas.requestRenderAll()
      })
    } else {
      canvas.backgroundColor = '#ffffff'
    }

    const changed = () => !drawing.current && latest.current.onChange(page.key)
    const selection = () => latest.current.onSelect(canvas.getActiveObject() ?? null)
    canvas.on('object:added', changed)
    canvas.on('object:modified', changed)
    canvas.on('object:removed', changed)
    canvas.on('selection:created', selection)
    canvas.on('selection:updated', selection)
    canvas.on('selection:cleared', selection)

    canvas.on('mouse:down', ({ scenePoint: point }) => {
      const { tool: current, style: s, onActivate: activate, onToolDone: done } = latest.current
      activate(page.key)
      if (current === 'text' || current === 'paragraph') {
        // Paragraph: a box that wraps words onto new lines (its width can be resized); Text: one line
        const paragraph = current === 'paragraph'
        const Type = paragraph ? Textbox : IText
        const text = new Type(paragraph ? 'Type your paragraph here.' : 'Type here', {
          ...topLeft,
          ...(paragraph && { width: Math.max(120, Math.min(360, page.width - point.x - 24)) }),
          left: point.x,
          top: point.y,
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fill: s.textColor,
          fontWeight: s.bold ? 'bold' : 'normal',
          fontStyle: s.italic ? 'italic' : 'normal',
          underline: s.underline,
          textAlign: s.align,
          opacity: s.opacity,
        })
        canvas.add(text)
        canvas.setActiveObject(text)
        text.enterEditing()
        text.selectAll()
        done()
        return
      }
      if (!SHAPE_TOOLS.includes(current)) return
      const look =
        current === 'whiteout'
          ? { fill: '#ffffff', stroke: null, strokeWidth: 0 }
          : { fill: s.fill, stroke: s.stroke, strokeWidth: s.strokeWidth, opacity: s.opacity, strokeUniform: true }
      const shape =
        current === 'line'
          ? new Line([point.x, point.y, point.x, point.y], {
              stroke: s.stroke,
              strokeWidth: s.strokeWidth,
              opacity: s.opacity,
            })
          : current === 'ellipse'
            ? new Ellipse({ ...topLeft, ...look, left: point.x, top: point.y, rx: 0.5, ry: 0.5 })
            : new Rect({ ...topLeft, ...look, left: point.x, top: point.y, width: 1, height: 1 })
      drawing.current = { shape, x: point.x, y: point.y }
      canvas.add(shape)
    })

    canvas.on('mouse:move', ({ scenePoint: point }) => {
      if (!drawing.current) return
      const { shape, x, y } = drawing.current
      if (shape.type === 'line') shape.set({ x2: point.x, y2: point.y })
      else if (shape.type === 'ellipse') {
        shape.set({
          left: Math.min(x, point.x),
          top: Math.min(y, point.y),
          rx: Math.abs(point.x - x) / 2,
          ry: Math.abs(point.y - y) / 2,
        })
      } else {
        shape.set({
          left: Math.min(x, point.x),
          top: Math.min(y, point.y),
          width: Math.abs(point.x - x),
          height: Math.abs(point.y - y),
        })
      }
      canvas.requestRenderAll()
    })

    canvas.on('mouse:up', () => {
      if (!drawing.current) return
      const { shape } = drawing.current
      shape.setCoords()
      const { width, height } = shape.getBoundingRect()
      // A click without dragging leaves nothing behind
      if (width < 3 && height < 3) canvas.remove(shape)
      else canvas.setActiveObject(shape)
      drawing.current = null
      latest.current.onChange(page.key)
      latest.current.onToolDone()
    })

    // Smart guides: while moving, snap to the page center / edges and to other objects, and show the line
    canvas.on('object:moving', ({ target }) => {
      const distance = SNAP_DISTANCE / canvas.getZoom()
      target.setCoords() // the position box is not updated during a drag by itself
      const box = target.getBoundingRect()
      const { xs, ys } = snapTargets(canvas, page, target)
      const snapX = closest([box.left, box.left + box.width / 2, box.left + box.width], xs, distance)
      const snapY = closest([box.top, box.top + box.height / 2, box.top + box.height], ys, distance)
      if (snapX) target.set({ left: target.left + snapX.delta })
      if (snapY) target.set({ top: target.top + snapY.delta })
      target.setCoords()
      guides.current = { x: snapX?.at ?? null, y: snapY?.at ?? null }
    })
    const clearGuides = () => {
      if (guides.current.x === null && guides.current.y === null) return
      guides.current = { x: null, y: null }
      canvas.requestRenderAll()
    }
    canvas.on('mouse:up', clearGuides)
    canvas.on('after:render', ({ ctx }) => {
      const { x, y } = guides.current
      if (x === null && y === null) return
      const zoom = canvas.getZoom()
      ctx.save()
      ctx.strokeStyle = GUIDE_COLOR
      ctx.lineWidth = 1
      ctx.setLineDash([5, 4])
      ctx.beginPath()
      if (x !== null) {
        ctx.moveTo(Math.round(x * zoom) + 0.5, 0)
        ctx.lineTo(Math.round(x * zoom) + 0.5, page.height * zoom)
      }
      if (y !== null) {
        ctx.moveTo(0, Math.round(y * zoom) + 0.5)
        ctx.lineTo(page.width * zoom, Math.round(y * zoom) + 0.5)
      }
      ctx.stroke()
      ctx.restore()
    })

    // A stored document's edits are put back first, so they are part of the page's starting point
    let disposed = false
    const start = async () => {
      if (page.objects?.length) {
        const objects = await util.enlivenObjects(page.objects)
        if (disposed) return
        canvas.add(...objects)
        canvas.requestRenderAll()
      }
      if (!disposed) onRegister(page.key, canvas)
    }
    start()
    return () => {
      disposed = true
      onUnregister(page.key)
      canvas.dispose()
    }
    // The canvas is made once per page; zoom and tool changes are applied below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.key])

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.setZoom(zoom)
    canvas.setDimensions({ width: page.width * zoom, height: page.height * zoom })
  }, [zoom, page.width, page.height])

  // Pen / highlighter draw freely; shape and text tools turn off selecting so a drag draws instead
  useEffect(() => {
    const canvas = canvasRef.current
    const drawingMode = tool === 'pen' || tool === 'highlighter'
    canvas.isDrawingMode = drawingMode
    if (drawingMode) {
      const brush = new PencilBrush(canvas)
      brush.color = tool === 'pen' ? style.penColor : HIGHLIGHT
      brush.width = tool === 'pen' ? style.penWidth : 14
      canvas.freeDrawingBrush = brush
    }
    const selecting = tool === 'select'
    canvas.selection = selecting
    canvas.defaultCursor = selecting ? 'default' : 'crosshair'
    canvas.forEachObject((object) => {
      object.selectable = selecting
      object.evented = selecting
    })
    if (!selecting) canvas.discardActiveObject()
    canvas.requestRenderAll()
  }, [tool, style.penColor, style.penWidth])

  return (
    <div
      className={`mx-auto w-fit shadow-md ring-2 ${active ? 'ring-brand-500' : 'ring-transparent'}`}
      onMouseDown={() => onActivate(page.key)}
    >
      <canvas ref={element} />
    </div>
  )
}

export default PdfPageCanvas
