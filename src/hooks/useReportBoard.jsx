import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getReportBoard, updateReport } from '../services/supportService'

// Reports of one type ('bug' | 'feature') for the developers' Kanban board
function useReportBoard(type) {
  const [result, setResult] = useState({ type: null, reports: [], error: '' })
  const loading = result.type !== type

  useEffect(() => {
    let ignore = false
    getReportBoard(type)
      .then((reports) => !ignore && setResult({ type, reports, error: '' }))
      .catch(() => !ignore && setResult({ type, reports: [], error: 'Could not load reports. Please try again.' }))
    return () => {
      ignore = true
    }
  }, [type])

  const replace = (updated) =>
    setResult((prev) => ({ ...prev, reports: prev.reports.map((item) => (item.id === updated.id ? updated : item)) }))

  // Saves a change from the report modal and returns the updated report. Throws so the modal can show the error.
  const changeReport = async (id, changes) => {
    const updated = await updateReport(id, changes)
    replace(updated)
    toast.success(changes.status ? 'Report moved' : changes.review ? 'Review updated' : 'Report assigned')
    return updated
  }

  // Drag and drop: move on screen first, then save (moves back if saving fails)
  const moveReport = (id, status) => {
    const report = result.reports.find((item) => item.id === id)
    if (!report || report.status === status) return
    replace({ ...report, status })
    updateReport(id, { status }).catch((error) => {
      replace(report)
      toast.error(error.message)
    })
  }

  return { reports: result.reports, loading, error: result.error, changeReport, moveReport }
}

export default useReportBoard
