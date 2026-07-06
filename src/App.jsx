import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import VehicleList from './components/VehicleList'
import Inspection from './components/Inspection'
import Report from './components/Report'
import BookingsList from './components/BookingsList'
import BookingDetail from './components/BookingDetail'
import AddBooking from './components/AddBooking'
import { vehicles as mockVehicles, mockBookings } from './mockData'

const STORAGE_KEY = 'fleetinspect_bookings'
const DATA_VERSION_KEY = 'fleetinspect_data_version'
const CURRENT_VERSION = '2' // bump this when mock data schema changes

function loadBookings() {
  try {
    const version = localStorage.getItem(DATA_VERSION_KEY)
    if (version === CURRENT_VERSION) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } else {
      // Clear stale data from old schema
      localStorage.removeItem(STORAGE_KEY)
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION)
    }
  } catch (e) { /* ignore */ }
  return mockBookings
}

function saveBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  } catch (e) { /* localStorage full — ignore */ }
}

export default function App() {
  const [vehicles] = useState(mockVehicles)
  const [view, setView] = useState('dashboard')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [inspections, setInspections] = useState([])
  const [currentReport, setCurrentReport] = useState(null)
  const [bookings, setBookings] = useState(loadBookings)
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Persist bookings to localStorage whenever they change
  useEffect(() => {
    saveBookings(bookings)
  }, [bookings])

  function startInspection(vehicle) {
    setSelectedVehicle(vehicle)
    setView('inspection')
  }

  function saveInspection(report) {
    setInspections(prev => [report, ...prev])
    setCurrentReport(report)
    setView('report')
  }

  function openBooking(booking) {
    setSelectedBooking(booking)
    setView('bookingDetail')
  }

  function updateBooking(updated) {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b))
    setSelectedBooking(updated)
  }

  function addBooking(newBooking) {
    setBookings(prev => [newBooking, ...prev])
    setView('bookings')
  }

  function markReturned(bookingId) {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'Returned' } : b
    )
    setBookings(updated)
    // Also update selectedBooking if we're viewing it
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: 'Returned' })
    }
  }

  const isBookingView = view === 'bookings' || view === 'bookingDetail' || view === 'addBooking'

  return (
    <div className="min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-6 rounded-2xl border border-white/60 bg-white/80 backdrop-blur px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">FleetInspect AI</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Vehicle return inspection workspace</h1>
              <p className="mt-1 text-sm text-slate-500">A clean, operator-first flow for documenting damage and generating reports.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={()=>setView('dashboard')} className={`rounded-full px-4 py-2 text-sm transition ${view==='dashboard' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Dashboard</button>
              <button onClick={()=>setView('vehicles')} className={`rounded-full px-4 py-2 text-sm transition ${view==='vehicles' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Vehicles</button>
              <button onClick={()=>setView('bookings')} className={`rounded-full px-4 py-2 text-sm transition ${isBookingView ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Bookings</button>
              <div className="ml-2 rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-700">Operator: Alex Morgan</div>
            </div>
          </div>
        </header>

        <main>
          {view === 'dashboard' && (
            <Dashboard vehicles={vehicles} inspections={inspections} bookings={bookings} onInspect={startInspection} />
          )}

          {view === 'vehicles' && (
            <VehicleList vehicles={vehicles} onInspect={startInspection} />
          )}

          {view === 'inspection' && selectedVehicle && (
            <Inspection vehicle={selectedVehicle} onCancel={()=>setView('dashboard')} onSave={saveInspection} />
          )}

          {view === 'report' && currentReport && (
            <Report report={currentReport} onBack={()=>setView('dashboard')} />
          )}

          {view === 'bookings' && (
            <BookingsList
              bookings={bookings}
              onOpenBooking={openBooking}
              onAddBooking={() => setView('addBooking')}
              onMarkReturned={markReturned}
            />
          )}

          {view === 'addBooking' && (
            <AddBooking onSave={addBooking} onCancel={() => setView('bookings')} />
          )}

          {view === 'bookingDetail' && selectedBooking && (
            <BookingDetail booking={selectedBooking} onBack={()=>setView('bookings')} onUpdateBooking={updateBooking} onMarkReturned={markReturned} />
          )}
        </main>
      </div>
    </div>
  )
}
