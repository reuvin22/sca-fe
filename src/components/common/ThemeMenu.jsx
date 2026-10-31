import { useDispatch, useSelector } from 'react-redux'
import { Check } from 'lucide-react'
import Dropdown from '../ui/Dropdown'
import { setPalette, setTheme } from '../../store/uiSlice'
import { PALETTES, THEMES } from '../../utils/themeHelpers'

const itemClass =
  'flex w-full cursor-pointer items-center gap-2 rounded-md p-1.5 text-left text-sm text-gray-700 hover:bg-gray-50'

// Light or Dark mode, plus an optional custom color palette on top
function ThemeMenu() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.ui.theme)
  const palette = useSelector((state) => state.ui.palette)
  const CurrentIcon = THEMES.find((item) => item.id === theme)?.icon ?? THEMES[0].icon
  const palettes = [{ id: null, label: 'Default', colors: [] }, ...PALETTES]

  return (
    <Dropdown label="Change theme" trigger={<CurrentIcon size={20} />}>
      {() => (
        <>
          <div className="px-2 py-2">
            <p className="mb-1 px-1.5 text-xs font-medium text-gray-500">Mode</p>
            {THEMES.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => dispatch(setTheme(id))} className={itemClass}>
                <Icon size={16} className="text-gray-400" />
                {label}
                {theme === id && <Check size={14} className="ml-auto text-gray-500" />}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 px-2 py-2">
            <p className="mb-1 px-1.5 text-xs font-medium text-gray-500">Custom colors</p>
            {palettes.map(({ id, label, colors }) => (
              <button
                key={label}
                type="button"
                aria-label={`${label} palette`}
                onClick={() => dispatch(setPalette(id))}
                className={`${itemClass} ${palette === id ? 'bg-gray-50' : ''}`}
              >
                <span className="flex h-5 w-20 shrink-0 overflow-hidden rounded border border-gray-200">
                  {colors.map((color) => (
                    <span key={color} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </span>
                {label}
                {palette === id && <Check size={14} className="ml-auto text-gray-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </Dropdown>
  )
}

export default ThemeMenu
