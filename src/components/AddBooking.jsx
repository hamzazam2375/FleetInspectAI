import React, { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateDummyBooking, preTripFindingsPool } from '../mockData'

export default function AddBooking({ onSave, onCancel }) {
  const booking = useMemo(() => generateDummyBooking(), [])
  const [images, setImages] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [findings, setFindings] = useState([])
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
    setImages(prev => [...prev, ...mapped])
    setFindings([])
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  function removeImage(i) {
    setImages(prev => {
      const next = [...prev]
      URL.revokeObjectURL(next[i].url)
      next.splice(i, 1)
      return next
    })
    setFindings([])
  }

  function runPreTripAnalysis() {
    if (images.length === 0) return
    setAnalyzing(true)
    setTimeout(() => {
      const count = Math.min(2 + Math.floor(Math.random() * 2), images.length, preTripFindingsPool.length)
      const shuffled = [...preTripFindingsPool].sort(() => 0.5 - Math.random())
      setFindings(shuffled.slice(0, count))
      setAnalyzing(false)
    }, 2000)
  }

  async function handleCreate() {
    // Convert images to base64 for localStorage
    const base64Images = await Promise.all(
      images.map(async (img) => {
        const b64 = await fileToBase64(img.file)
        return { name: img.name, data: b64 }
      })
    )
    const newBooking = {
      ...booking,
      preTripImages: base64Images,
      preTripFindings: findings.length > 0 ? findings : [],
    }
    onSave(newBooking)
  }

  const canCreate = images.length > 0

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Back button */}
      <button
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition group"
      >
        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Bookings
      </button>

      {/* Title */}
      <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur mb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="rounded-full bg-indigo-50 p-2.5">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">New Booking</h2>
            <p className="text-sm text-slate-500">Pre-filled with auto-generated details. Upload pre-trip images to proceed.</p>
          </div>
        </div>
      </div>

      {/* Auto-generated booking details (read-only) */}
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

        {/* Booking info */}
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
            <InfoRow label="Booking ID" value={booking.id} />
            <InfoRow label="Pickup" value={booking.pickupDate} />
            <InfoRow label="Return" value={booking.returnDate} />
            <InfoRow label="Location" value={booking.pickupLocation} />
            <InfoRow label="Total Cost" value={`$${booking.totalCost.toFixed(2)}`} />
            <InfoRow label="Deposit" value={`$${booking.deposit.toFixed(2)}`} />
          </div>
        </div>
      </div>

      {booking.notes && (
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur mb-5">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className="text-sm font-semibold text-slate-700">Notes</h3>
          </div>
          <p className="text-sm text-slate-600">{booking.notes}</p>
        </div>
      )}

      {/* ─── Pre-Trip Image Upload (REQUIRED) ─── */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-white/80 p-6 shadow-sm backdrop-blur mb-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-indigo-50 p-2">
              <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Pre-Trip Images <span className="text-red-500">*</span></h3>
              <p className="text-xs text-slate-400 mt-0.5">Required — Upload photos of the car before the trip</p>
            </div>
          </div>
          {images.length > 0 && (
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {images.length} photo{images.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {images.length === 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
            <svg className="h-4 w-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs text-amber-700 font-medium">You must upload at least one pre-trip image to create this booking.</span>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current && fileRef.current.click()}
          className={`mt-4 relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            dragOver
              ? 'border-indigo-400 bg-indigo-50/50 scale-[1.01]'
              : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30'
          }`}
        >
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={e => addFiles(e.target.files)} className="hidden" />
          <svg className={`mx-auto h-10 w-10 mb-3 transition-colors ${dragOver ? 'text-indigo-400' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="text-sm font-medium text-slate-600 mb-1">{dragOver ? 'Drop images here' : 'Click to upload or drag & drop'}</div>
          <div className="text-xs text-slate-400">PNG, JPG, WEBP — document all sides of the vehicle</div>
        </div>

        {/* Image previews */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <motion.div key={img.url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="group relative">
                  <img src={img.url} alt={img.name} className="h-32 w-full rounded-xl object-cover ring-1 ring-slate-200/60" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button onClick={e => { e.stopPropagation(); removeImage(i) }} className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 text-xs text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">{img.name}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze button */}
        {images.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <button
              onClick={runPreTripAnalysis}
              disabled={analyzing}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                  Analyzing pre-trip condition…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  Run Pre-Trip AI Analysis
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Pre-trip findings */}
        <AnimatePresence>
          {findings.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Pre-Trip Baseline Findings</div>
              <div className="space-y-2">
                {findings.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-2.5 rounded-lg bg-white p-3 border border-slate-100">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${f.severity === 'Major' ? 'bg-red-500' : f.severity === 'Minor' ? 'bg-amber-500' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700">{f.title}</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-slate-500">Confidence: {(f.confidence * 100).toFixed(0)}%</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className={`text-xs font-medium ${f.severity === 'Major' ? 'text-red-600' : f.severity === 'Minor' ? 'text-amber-600' : 'text-blue-600'}`}>{f.severity}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create booking button */}
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">Cancel</button>
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition shadow-md ${
            canCreate
              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
          </svg>
          Create Booking
        </button>
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
