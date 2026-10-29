import { Plus } from 'lucide-react'

const pillButton = 'w-full cursor-pointer rounded-full py-2 text-sm font-medium text-white transition hover:opacity-90'

function EventCards({ appointment }) {
  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <div className="bg-sky-400 p-5 text-white">
        <p className="text-xs uppercase opacity-90">{appointment.date}</p>
        <p className="mt-1 text-3xl font-bold">{appointment.time}</p>
        <p className="text-sm opacity-90">with {appointment.student}</p>
        <button className={`mt-4 bg-purple-600 ${pillButton}`}>Send reminder</button>
      </div>

      <div className="bg-emerald-400 p-5 text-center text-white">
        <div className="flex justify-end">
          <Plus size={18} />
        </div>
        <p className="text-2xl font-bold">New Event</p>
        <button className={`mt-4 bg-fuchsia-600 ${pillButton}`}>Add</button>
      </div>
    </div>
  )
}

export default EventCards
