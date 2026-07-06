import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { postTripFindingsPool } from '../mockData'

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

export default function BookingDetail({ booking, onBack, onUpdateBooking, onMarkReturned }) {
  const [postImages, setPostImages] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [postFindings, setPostFindings] = useState(booking.postTripFindings || [])
  const [comparisonReport, setComparisonReport] = useState(booking.comparisonReport || null)
  const fileRef = useRef()

  function fileToBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(file)
    })
  }

  function addFiles(fileList) {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    if (files.length === 0) return
    const mapped = files.map(f => ({ file: f, url: URL.createObjectURL(f), name: f.name }))
    setPostImages(prev => [...prev, ...mapped])
    setPostFindings([])
    setComparisonReport(null)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  function removeImage(i) {
    setPostImages(prev => {
      const next = [...prev]
      URL.revokeObjectURL(next[i].url)
      next.splice(i, 1)
      return next
    })
  }

  function runComparison() {
    if (postImages.length === 0) return
    setAnalyzing(true)
    setPostFindings([])
    setComparisonReport(null)

    setTimeout(async () => {
      // Simulate post-trip AI findings
      // Start with all pre-trip findings carried over (pre-existing damage doesn't disappear)
      const carriedOver = (booking.preTripFindings || []).map(f => ({
        ...f,
        confidence: Math.min(1, f.confidence + (Math.random() * 0.1 - 0.03)), // slight confidence shift
        action: 'Pre-existing'
      }))

      // Add 1-3 new random damages from the pool (excluding titles already in pre-trip)
      const preTitles = new Set((booking.preTripFindings || []).map(f => f.title))
      const newOnly = postTripFindingsPool.filter(f => !preTitles.has(f.title))
      const shuffled = [...newOnly].sort(() => 0.5 - Math.random())
      const newCount = 1 + Math.floor(Math.random() * Math.min(3, shuffled.length))
      const newItems = shuffled.slice(0, newCount)

      const newPostFindings = [...carriedOver, ...newItems]
      setPostFindings(newPostFindings)

      // Generate comparison (preTitles already defined above)
      const postTitles = new Set(newPostFindings.map(f => f.title))

      const preExisting = newPostFindings
        .filter(f => preTitles.has(f.title))
        .map(f => ({ title: f.title, severity: f.severity }))

      const newDamage = newPostFindings
        .filter(f => !preTitles.has(f.title))
        .map(f => ({ title: f.title, severity: f.severity, action: f.action }))

      const resolved = (booking.preTripFindings || [])
        .filter(f => !postTitles.has(f.title))
        .map(f => ({ title: f.title, severity: f.severity }))

      const report = { preExisting, newDamage, resolved }
      setComparisonReport(report)

      // Convert post images to base64 and save
      const base64PostImages = await Promise.all(
        postImages.map(async (img) => {
          const b64 = await fileToBase64(img.file)
          return { name: img.name, data: b64 }
        })
      )

      onUpdateBooking({
        ...booking,
        status: 'Completed',
        postTripImages: base64PostImages,
        postTripFindings: newPostFindings,
        comparisonReport: report
      })

      setAnalyzing(false)
    }, 2500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition group"
      >
        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Bookings
      </button>

      {/* ─── Mark as Returned (only for Active status) ─── */}
      {booking.status === 'Active' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-6 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2.5">
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-800">Vehicle returned?</div>
              <div className="text-xs text-amber-600">Mark this booking as returned to upload post-trip inspection photos.</div>
            </div>
          </div>
          <button
            onClick={() => onMarkReturned(booking.id)}
            className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 transition whitespace-nowrap"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
            Mark as Returned
          </button>
        </motion.div>
      )}

      {/* ─── Completed Banner ─── */}
      {booking.status === 'Completed' && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 flex items-center gap-4">
          <div className="rounded-full bg-emerald-100 p-3">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-base font-semibold text-emerald-800">Inspection Completed</div>
            <div className="text-sm text-emerald-600">This booking has been fully inspected. Pre-trip and post-trip analysis is available below.</div>
          </div>
        </motion.div>
      )}

      {/* Header card */}
      <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur mb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-semibold">{booking.customerName}</h2>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[booking.status]}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[booking.status]}`} />
                {booking.status}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400 tracking-wider">{booking.id}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800">${booking.totalCost.toFixed(2)}</div>
            <div className="text-xs text-slate-400 mt-0.5">Total Cost</div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Customer */}
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-full bg-indigo-50 p-2">
              <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Customer Details</h3>
          </div>
          <div className="space-y-3">
            <InfoRow label="Name" value={booking.customerName} />
            <InfoRow label="Email" value={booking.customerEmail} />
            <InfoRow label="Phone" value={booking.customerPhone} />
          </div>
        </div>

        {/* Vehicle */}
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-full bg-emerald-50 p-2">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.38L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Vehicle Details</h3>
          </div>
          <div className="space-y-3">
            <InfoRow label="Model" value={booking.vehicleModel} />
            <InfoRow label="Registration" value={booking.vehicleReg} />
            <InfoRow label="Vehicle ID" value={booking.vehicleId} />
          </div>
        </div>

        {/* Booking */}
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-full bg-amber-50 p-2">
              <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Booking Details</h3>
          </div>
          <div className="space-y-3">
            <InfoRow label="Pickup" value={booking.pickupDate} />
            <InfoRow label="Return" value={booking.returnDate} />
            <InfoRow label="Location" value={booking.pickupLocation} />
            <InfoRow label="Deposit" value={`$${booking.deposit.toFixed(2)}`} />
          </div>
        </div>
      </div>

      {/* Notes — compact, not full width */}
      {booking.notes && (
        <div className="max-w-md rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur mb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className="text-sm font-semibold text-slate-700">Notes</h3>
          </div>
          <p className="text-sm text-slate-600">{booking.notes}</p>
        </div>
      )}

      {/* ─── Pre-Trip & Post-Trip Images Side by Side ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Pre-Trip Images */}
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-full bg-blue-50 p-2">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Pre-Trip Images</h3>
              <p className="text-xs text-slate-400">Before the trip</p>
            </div>
          </div>

          {booking.preTripImages && booking.preTripImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {booking.preTripImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img.data} alt={img.name} className="h-28 w-full rounded-xl object-cover ring-1 ring-slate-200/60" />
                  <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                    <div className="text-[10px] text-white truncate">{img.name}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-400 mb-3">
              No pre-trip images
            </div>
          )}

          {booking.preTripFindings && booking.preTripFindings.length > 0 && (
            <div className="rounded-xl bg-blue-50/60 p-3">
              <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-2">Baseline Findings</div>
              <div className="space-y-1.5">
                {booking.preTripFindings.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-white p-2 border border-blue-100">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${f.severity === 'Major' ? 'bg-red-500' : f.severity === 'Minor' ? 'bg-amber-500' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-700">{f.title}</div>
                      <div className="text-[10px] text-slate-500">{(f.confidence * 100).toFixed(0)}% • {f.severity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Post-Trip Images — upload zone for Returned, read-only for Completed, placeholder for Active */}
        <div className={`rounded-2xl border ${booking.status === 'Returned' ? 'border-2 border-amber-200' : 'border-white/70'} bg-white/80 p-5 shadow-sm backdrop-blur`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-amber-50 p-2">
                <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Post-Trip Images</h3>
                <p className="text-xs text-slate-400">{booking.status === 'Returned' ? 'Upload return photos' : 'After the trip'}</p>
              </div>
            </div>
            {postImages.length > 0 && booking.status === 'Returned' && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                {postImages.length} photo{postImages.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Active — no post-trip yet */}
          {booking.status === 'Active' && (
            <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
              <svg className="mx-auto h-8 w-8 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-slate-400">Post-trip images will be uploaded after the vehicle is returned.</div>
            </div>
          )}

          {/* Returned — upload zone */}
          {booking.status === 'Returned' && (
            <>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current && fileRef.current.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
                  dragOver
                    ? 'border-amber-400 bg-amber-50/50 scale-[1.01]'
                    : 'border-slate-200 bg-slate-50/50 hover:border-amber-300 hover:bg-amber-50/30'
                }`}
              >
                <input ref={fileRef} type="file" multiple accept="image/*" onChange={e => addFiles(e.target.files)} className="hidden" />
                <svg className={`mx-auto h-8 w-8 mb-2 transition-colors ${dragOver ? 'text-amber-400' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-xs font-medium text-slate-600 mb-0.5">{dragOver ? 'Drop here' : 'Click or drag & drop'}</div>
                <div className="text-[10px] text-slate-400">Upload post-trip photos</div>
              </div>

              <AnimatePresence>
                {postImages.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 grid grid-cols-2 gap-2">
                    {postImages.map((img, i) => (
                      <motion.div key={img.url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="group relative">
                        <img src={img.url} alt={img.name} className="h-28 w-full rounded-xl object-cover ring-1 ring-slate-200/60" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <button onClick={e => { e.stopPropagation(); removeImage(i) }} className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-slate-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {postImages.length > 0 && !comparisonReport && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                  <button
                    onClick={runComparison}
                    disabled={analyzing}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 disabled:opacity-60 transition"
                  >
                    {analyzing ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>Comparing…</>
                    ) : (
                      <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Run Comparison</>
                    )}
                  </button>
                </motion.div>
              )}
            </>
          )}

          {/* Completed — read-only post-trip gallery */}
          {booking.status === 'Completed' && booking.postTripImages && booking.postTripImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {booking.postTripImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img.data} alt={img.name} className="h-28 w-full rounded-xl object-cover ring-1 ring-slate-200/60" />
                  <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                    <div className="text-[10px] text-white truncate">{img.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {booking.status === 'Completed' && (!booking.postTripImages || booking.postTripImages.length === 0) && (
            <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-400">
              No post-trip images
            </div>
          )}
        </div>
      </div>

      {/* Old separate post-trip sections removed — now integrated above */}

      {/* ─── Comparison Report ─── */}
      {(comparisonReport || (booking.status === 'Completed' && booking.comparisonReport)) && (
        <ComparisonReport report={comparisonReport || booking.comparisonReport} />
      )}
    </motion.div>
  )
}

function ComparisonReport({ report }) {
  const chargePrices = { Major: 250, Minor: 120, Low: 60 }

  const charges = (report.newDamage || []).map(f => ({
    ...f,
    cost: chargePrices[f.severity] || 100
  }))
  const totalCharges = charges.reduce((sum, c) => sum + c.cost, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur mb-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="rounded-full bg-violet-50 p-2">
          <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-800">Damage Comparison Report</h3>
          <p className="text-xs text-slate-400">Pre-trip vs Post-trip analysis results</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* 1. Pre-existing Damage */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3 w-3 rounded-full bg-blue-400" />
            <span className="text-sm font-semibold text-blue-800">Pre-existing Damage</span>
            <span className="ml-auto text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">{report.preExisting.length} issue{report.preExisting.length !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-blue-600 mb-3">Found in both pre-trip and post-trip inspection — no additional charge</p>
          {report.preExisting.length === 0 ? (
            <div className="text-xs text-blue-400 italic">No pre-existing damage detected</div>
          ) : (
            <ul className="space-y-2">
              {report.preExisting.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-700 bg-white rounded-lg p-3 border border-blue-100">
                  <svg className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <div className="font-medium">{f.title}</div>
                    <div className="text-xs text-blue-500 mt-0.5">{f.severity} • No charge</div>
                  </div>
                  <span className="text-xs font-medium text-blue-400 bg-blue-50 px-2 py-1 rounded-full">Pre-existing</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 2. Post-Trip Damage (new) */}
        <div className="rounded-xl border border-red-100 bg-red-50/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-red-800">Post-Trip Damage</span>
            <span className="ml-auto text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded-full">{(report.newDamage || []).length} issue{(report.newDamage || []).length !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-red-600 mb-3">New damage detected only in post-trip inspection — customer liability</p>
          {(report.newDamage || []).length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              No new damage detected — vehicle returned in good condition!
            </div>
          ) : (
            <ul className="space-y-2">
              {report.newDamage.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700 bg-white rounded-lg p-3 border border-red-100">
                  <svg className="h-4 w-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <div className="font-medium">{f.title}</div>
                    <div className="text-xs text-red-500 mt-0.5">{f.severity} • {f.action}</div>
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">New</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3. Additional Charges */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-amber-800">Additional Charges</span>
          </div>
          <p className="text-xs text-amber-600 mb-3">Estimated repair costs for new damage found post-trip</p>

          {charges.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              No additional charges — deposit will be fully refunded.
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {charges.map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-amber-800">{c.title}</div>
                        <div className="text-xs text-amber-500">{c.severity} damage • {c.action}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-amber-800">${c.cost.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between rounded-lg bg-amber-100 p-4 border border-amber-200">
                <div className="text-sm font-semibold text-amber-900">Total Additional Charges</div>
                <div className="text-lg font-bold text-amber-900">${totalCharges.toFixed(2)}</div>
              </div>
            </>
          )}
        </div>

      </div>
    </motion.div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-slate-700 text-right font-medium">{value}</span>
    </div>
  )
}
