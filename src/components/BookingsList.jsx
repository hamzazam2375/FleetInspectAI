import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Returned: 'bg-amber-100 text-amber-800 border-amber-200',
  Completed: 'bg-slate-100 text-slate-600 border-slate-200'
}

const statusDot = {
  Active: 'bg-emerald-500',
  Returned: 'bg-amber-500',
  Completed: 'bg-slate-400'
}

export default function BookingsList({ bookings, onOpenBooking, onAddBooking, onMarkReturned }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filters = ['All', 'Active', 'Returned', 'Completed']

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'All' || b.status === filter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.vehicleModel.toLowerCase().includes(q) ||
      b.vehicleReg.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold">Bookings</h2>
          <p className="text-sm text-slate-500">{bookings.length} total bookings in the system</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bookings…"
              className="w-full sm:w-56 rounded-full border border-slate-200 bg-white/90 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          {/* Add Booking button */}
          <button
            onClick={onAddBooking}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition whitespace-nowrap"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Booking
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${filter === f
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            {f}
            <span className="ml-1.5 text-xs opacity-70">
              ({f === 'All' ? bookings.length : bookings.filter(b => b.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              whileHover={{ scale: 1.015, y: -2 }}
              onClick={() => onOpenBooking(booking)}
              className="cursor-pointer rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur hover:shadow-md hover:border-indigo-200/60 transition-all duration-200 group"
            >
              {/* Top row: ID + Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-mono text-slate-400 tracking-wider">{booking.id}</div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[booking.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot[booking.status]}`} />
                  {booking.status}
                </span>
              </div>

              {/* Customer name */}
              <div className="text-base font-semibold mb-1 group-hover:text-indigo-700 transition-colors">{booking.customerName}</div>

              {/* Vehicle */}
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.38L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                </svg>
                <span className="text-sm text-slate-600">{booking.vehicleModel}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-mono">{booking.vehicleReg}</span>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <svg className="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{booking.pickupDate}</span>
                <span className="text-slate-300">→</span>
                <span>{booking.returnDate}</span>
              </div>

              {/* Bottom row: Cost + action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="text-sm font-semibold text-slate-700">${booking.totalCost.toFixed(2)}</div>

                {booking.status === 'Active' && (
                  <button
                    onClick={e => { e.stopPropagation(); onMarkReturned(booking.id) }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-full px-3 py-1.5 transition"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>
                    Mark Returned
                  </button>
                )}

                {booking.status === 'Returned' && (
                  <div className="flex items-center gap-1 text-xs text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Upload post-trip
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                {booking.status === 'Completed' && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Inspection done
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center mt-4">
          <svg className="mx-auto h-10 w-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-slate-500">No bookings match your search.</div>
        </motion.div>
      )}
    </div>
  )
}
