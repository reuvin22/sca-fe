import { useEffect, useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { getBarangays, getCities, getProvinces, getRegions } from '../../services/geoService'

// Loads a place list whenever `key` changes (null = parent not chosen yet).
// Loading is derived from the key so no state is set synchronously in the effect.
function usePlaces(key, load) {
  const [state, setState] = useState({ key: null, list: [], error: '' })

  useEffect(() => {
    if (!key) return
    let active = true
    load()
      .then((list) => active && setState({ key, list, error: '' }))
      .catch((error) => active && setState({ key, list: [], error: error.message }))
    return () => {
      active = false
    }
    // `load` is rebuilt each render; the key says when the list really changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const ready = Boolean(key) && state.key === key
  return {
    list: ready ? state.list : [],
    loading: Boolean(key) && !ready,
    error: ready ? state.error : '',
  }
}

// Cascading Philippine address: Region -> Province -> City/Municipality -> Barangay, then Street.
// Regions without provinces (NCR) skip the province and list their cities directly.
// `value` is { region, province, city, barangay, street } with places as { code, name };
// `onChange` receives the whole new address. `errors` may have region/province/city/barangay/street.
function AddressFields({ value, onChange, errors = {}, idPrefix = 'address' }) {
  const { region, province, city, barangay, street } = value
  const regions = usePlaces('regions', getRegions)
  const provinces = usePlaces(region?.code ?? null, () => getProvinces(region.code))
  const hasProvinces = provinces.list.length > 0

  // Cities wait until we know whether the region has provinces
  const cityParent = provinces.loading ? null : hasProvinces ? province?.code : region?.code
  const cities = usePlaces(cityParent ? `${hasProvinces ? 'p' : 'r'}${cityParent}` : null, () =>
    getCities(hasProvinces ? { provinceCode: cityParent } : { regionCode: cityParent }),
  )
  const barangays = usePlaces(city?.code ?? null, () => getBarangays(city.code))

  // Choosing a place clears everything under it
  const choose = (level, places) => (e) => {
    const place = places.find((item) => item.code === e.target.value) ?? null
    if (level === 'region')
      onChange({
        ...value,
        region: place,
        province: null,
        city: null,
        barangay: null,
      })
    if (level === 'province') onChange({ ...value, province: place, city: null, barangay: null })
    if (level === 'city') onChange({ ...value, city: place, barangay: null })
    if (level === 'barangay') onChange({ ...value, barangay: place })
  }

  const options = ({ list, loading, error }, placeholder) => [
    { value: '', label: loading ? 'Loading...' : error || placeholder },
    ...list.map(({ code, name }) => ({ value: code, label: name })),
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        label="Region *"
        id={`${idPrefix}-region`}
        value={region?.code ?? ''}
        onChange={choose('region', regions.list)}
        options={options(regions, 'Select region')}
        disabled={regions.loading}
        error={errors.region || regions.error}
      />
      {(!region || provinces.loading || hasProvinces) && (
        <Select
          label="Province *"
          id={`${idPrefix}-province`}
          value={province?.code ?? ''}
          onChange={choose('province', provinces.list)}
          options={options(provinces, region ? 'Select province' : 'Select a region first')}
          disabled={!region || provinces.loading}
          error={errors.province || provinces.error}
        />
      )}
      <Select
        label="City / Municipality *"
        id={`${idPrefix}-city`}
        value={city?.code ?? ''}
        onChange={choose('city', cities.list)}
        options={options(cities, cityParent ? 'Select city / municipality' : 'Select a province first')}
        disabled={!cityParent || cities.loading}
        error={errors.city || cities.error}
      />
      <Select
        label="Barangay *"
        id={`${idPrefix}-barangay`}
        value={barangay?.code ?? ''}
        onChange={choose('barangay', barangays.list)}
        options={options(barangays, city ? 'Select barangay' : 'Select a city first')}
        disabled={!city || barangays.loading}
        error={errors.barangay || barangays.error}
      />
      <div className="sm:col-span-2">
        <Input
          label="House no. / Street / Subdivision"
          id={`${idPrefix}-street`}
          placeholder="e.g. Blk 1 Lot 2, Mabini St."
          maxLength={200}
          value={street}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
          error={errors.street}
        />
      </div>
    </div>
  )
}

export default AddressFields
