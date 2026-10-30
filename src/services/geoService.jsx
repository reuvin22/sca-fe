// Philippine places from the PSGC API (free, public, no key): region -> province -> city/municipality -> barangay.
// https://psgc.gitlab.io/api/
const PSGC_URL = 'https://psgc.gitlab.io/api'
const cache = new Map() // each list downloads once per visit

// [{ code, name }] sorted by name, or [] when the list doesn't exist (e.g. NCR has no provinces).
// The API sends JSON labeled as HTML, so the body is parsed by hand.
async function getPlaces(path) {
  if (!cache.has(path)) {
    const request = fetch(`${PSGC_URL}/${path}/`)
      .then((response) => {
        if (!response.ok) throw new Error('Could not load places. Please try again.')
        return response.text()
      })
      .then((text) => {
        try {
          const list = JSON.parse(text)
          if (!Array.isArray(list)) return []
          return list.map(({ code, name }) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name))
        } catch {
          return []
        }
      })
    // Forget failed requests so the user can try again
    cache.set(
      path,
      request.catch((error) => {
        cache.delete(path)
        throw error
      }),
    )
  }
  return cache.get(path)
}

export const getRegions = () => getPlaces('regions')
export const getProvinces = (regionCode) => getPlaces(`regions/${regionCode}/provinces`)

// Cities/municipalities of a province, or of a region that has no provinces (NCR)
export const getCities = ({ provinceCode, regionCode }) =>
  getPlaces(
    provinceCode ? `provinces/${provinceCode}/cities-municipalities` : `regions/${regionCode}/cities-municipalities`,
  )

export const getBarangays = (cityCode) => getPlaces(`cities-municipalities/${cityCode}/barangays`)
