import { MessagesSquare } from 'lucide-react'

// Placeholder until the consultation feature is built
function ConsultationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Consultation</h1>
        <p className="text-sm text-gray-500">Student consultations.</p>
      </div>

      <section className="flex flex-col items-center gap-3 rounded-xl bg-surface px-6 py-16 text-center shadow-sm">
        <span className="rounded-full bg-brand-50 p-4 text-brand-600">
          <MessagesSquare size={32} />
        </span>
        <h2 className="text-xl font-semibold text-gray-900">Coming soon</h2>
        <p className="max-w-sm text-sm text-gray-500">We're working on this page. Check back later.</p>
      </section>
    </div>
  )
}

export default ConsultationPage
