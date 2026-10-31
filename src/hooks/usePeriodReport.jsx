import { useEffect, useState } from 'react'
import { getPeriodReport } from '../services/reportService'

// Loads the monthly/annual report. The old report stays on screen while a new period loads.
function usePeriodReport(year, month) {
  const key = `${year}-${month ?? ''}`
  const [result, setResult] = useState({ key: null, report: null, error: '' })

  useEffect(() => {
    let ignore = false
    getPeriodReport({ year, month })
      .then((report) => !ignore && setResult({ key, report, error: '' }))
      .catch(
        (err) => !ignore && setResult((prev) => ({ ...prev, key, error: err.message || 'Could not load the report.' })),
      )
    return () => {
      ignore = true
    }
  }, [key, year, month])

  return { report: result.report, refreshing: result.key !== key, error: result.error }
}

export default usePeriodReport
