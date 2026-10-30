import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react'
import Alert from '../ui/Alert'
import Skeleton from '../ui/Skeleton'

// Slides are drawn at this size, then scaled to fit the screen (16:9)
const SLIDE_WIDTH = 960
const SLIDE_HEIGHT = 540

const NEXT_KEYS = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter']
const PREVIOUS_KEYS = ['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace']

const CONTROL = 'flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40'

// PowerPoint (.pptx) presenter, drawn in the browser (the file is never sent anywhere).
// Controls: Previous / Next buttons, click the slide, arrow keys, Space, Page Up/Down, Home/End.
// Full screen with the button or F; Esc leaves full screen.
function SlidePreview({ file }) {
  const presenterRef = useRef(null) // goes full screen
  const stageRef = useRef(null) // the space the slide is scaled to fit
  const slideRef = useRef(null) // the library draws the slide here
  const previewerRef = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [count, setCount] = useState(0)
  const [index, setIndex] = useState(0)
  const [scale, setScale] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)

  // Load the library only when a presentation is opened (it is large), then draw slide 1
  useEffect(() => {
    let cancelled = false
    const slideElement = slideRef.current

    async function load() {
      const { init } = await import('pptx-preview')
      const previewer = init(slideElement, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, mode: 'slide' })
      previewerRef.current = previewer
      const data = await (await fetch(file.url)).arrayBuffer()
      await previewer.preview(data)
      if (cancelled) return
      setCount(previewer.slideCount)
      setStatus('ready')
    }

    load().catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
      previewerRef.current?.destroy()
      slideElement.innerHTML = ''
    }
  }, [file.url])

  const goTo = useCallback(
    (next) => {
      if (!previewerRef.current || next < 0 || next >= count) return
      previewerRef.current.renderSingleSlide(next)
      setIndex(next)
    },
    [count],
  )

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen()
    else presenterRef.current?.requestFullscreen()
  }, [])

  // Keyboard controls, like PowerPoint's slide show
  useEffect(() => {
    if (status !== 'ready') return
    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      let handled = true
      if (NEXT_KEYS.includes(e.key)) goTo(index + 1)
      else if (PREVIOUS_KEYS.includes(e.key)) goTo(index - 1)
      else if (e.key === 'Home') goTo(0)
      else if (e.key === 'End') goTo(count - 1)
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen()
      else handled = false
      if (handled) e.preventDefault() // e.g. Space shouldn't also press a focused button
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [status, index, count, goTo, toggleFullscreen])

  // Track full screen (it can also be left with Esc)
  useEffect(() => {
    const handleChange = () => setFullscreen(document.fullscreenElement === presenterRef.current)
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  // Scale the slide to the available space (modal or full screen)
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT))
    })
    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [])

  if (status === 'error') {
    return <Alert>This presentation could not be opened. Try downloading it instead.</Alert>
  }

  return (
    <div ref={presenterRef} className="flex flex-col overflow-hidden rounded-lg bg-black">
      <div ref={stageRef} className={`relative flex items-center justify-center ${fullscreen ? 'flex-1' : 'aspect-video w-full'}`}>
        {status === 'loading' && <Skeleton className="absolute inset-0 rounded-none" />}
        {/* Click the slide to go to the next one. The library's own buttons are hidden; ours are below. */}
        <div style={{ width: SLIDE_WIDTH * scale, height: SLIDE_HEIGHT * scale }} onClick={() => goTo(index + 1)} className="cursor-pointer overflow-hidden">
          <div
            ref={slideRef}
            style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}
            className="[&_.pptx-preview-wrapper-next]:hidden [&_.pptx-preview-wrapper-pagination]:hidden"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 bg-gray-950/90 px-3 py-2">
        <div className="flex items-center gap-1">
          <button type="button" className={CONTROL} onClick={() => goTo(index - 1)} disabled={status !== 'ready' || index === 0} aria-label="Previous slide">
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <span className="min-w-16 text-center text-sm text-white tabular-nums">{status === 'ready' ? `${index + 1} / ${count}` : '…'}</span>
          <button type="button" className={CONTROL} onClick={() => goTo(index + 1)} disabled={status !== 'ready' || index >= count - 1} aria-label="Next slide">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
        <button type="button" className={CONTROL} onClick={toggleFullscreen} disabled={status !== 'ready'} aria-label={fullscreen ? 'Exit full screen' : 'Present full screen'}>
          {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          <span className="hidden sm:inline">{fullscreen ? 'Exit full screen' : 'Present'}</span>
        </button>
      </div>
    </div>
  )
}

export default SlidePreview
