// Decorative side of the sign-in / register card: a diagonal purple-to-cyan panel with a
// low-poly pattern and a short greeting. Purely visual (hidden from screen readers).

// Faceted triangles drawn over the gradient (x,y points in a 400 × 600 box)
const FACETS = [
  ['0,0 140,0 60,120', 0.1],
  ['140,0 280,0 190,140', 0.05],
  ['280,0 400,0 400,110', 0.12],
  ['60,120 190,140 120,260', 0.07],
  ['190,140 280,0 330,210', 0.13],
  ['330,210 400,110 400,300', 0.06],
  ['120,260 190,140 330,210', 0.1],
  ['120,260 330,210 250,380', 0.04],
  ['330,210 400,300 400,440', 0.11],
  ['250,380 330,210 400,440', 0.07],
  ['120,260 250,380 150,470', 0.12],
  ['250,380 400,440 320,560', 0.05],
  ['150,470 250,380 320,560', 0.09],
  ['150,470 320,560 200,600', 0.04],
  ['320,560 400,440 400,600', 0.13],
]

function AuthArt({ title, message, className = '' }) {
  return (
    <div aria-hidden="true" className={`relative overflow-hidden ${className}`}>
      {/* The slanted edge: the panel starts narrow at the bottom and widens toward the top */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(22% 0, 100% 0, 100% 100%, 58% 100%)',
          background: 'linear-gradient(150deg, #8b5cf6 0%, #6d28d9 35%, #4f46e5 70%, #06b6d4 100%)',
        }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 600" preserveAspectRatio="none">
          {FACETS.map(([points, opacity]) => (
            <polygon key={points} points={points} fill="#fff" fillOpacity={opacity} />
          ))}
        </svg>
        {/* Soft glow and a few floating dots for a playful touch */}
        <div className="absolute -top-16 -right-16 size-56 rounded-full bg-white/10 blur-2xl" />
        <span className="absolute top-[58%] right-[18%] size-3 rounded-full bg-white/50" />
        <span className="absolute top-[70%] right-[34%] size-2 rounded-full bg-white/40" />
        <span className="absolute top-[80%] right-[12%] size-4 rounded-full border-2 border-white/50" />
      </div>

      <div className="relative ml-auto flex max-w-xs flex-col items-end px-8 pt-12 text-right text-white">
        <p className="text-5xl leading-none font-extrabold tracking-tight lg:text-6xl">{title}</p>
        <p className="mt-5 max-w-60 text-sm leading-relaxed text-white/85">{message}</p>
      </div>
    </div>
  )
}

export default AuthArt
