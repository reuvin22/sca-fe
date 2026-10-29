import Skeleton from '../ui/Skeleton'
import FollowUpBadge from './FollowUpBadge'

const columns = ['Case Number', 'Student', 'Grade & Section', 'Concern', 'Date', 'Follow-up']

function CasesTable({ cases, loading, onRowClick }) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    )
  }

  if (cases.length === 0) {
    return <p className="p-8 text-center text-sm text-gray-400">No cases found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-100 text-xs text-gray-500 uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium whitespace-nowrap">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cases.map((item) => (
            <tr key={item.id} onClick={() => onRowClick(item)} className="cursor-pointer text-gray-700 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium whitespace-nowrap text-gray-900">{item.caseNumber}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.studentName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.gradeSection}</td>
              <td className="px-4 py-3">{item.concern}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="mr-2">{item.followUpDate}</span>
                <FollowUpBadge date={item.followUpDate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CasesTable
