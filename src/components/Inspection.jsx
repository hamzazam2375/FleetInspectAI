import React, { useState } from 'react'
import ImageUploader from './ImageUploader'
import FindingsList from './FindingsList'
import { mockFindings } from '../mockData'
import { motion } from 'framer-motion'

export default function Inspection({ vehicle, onCancel, onSave }) {
  const [mileage, setMileage] = useState(vehicle.mileage || '')
  const [fuel, setFuel] = useState(vehicle.fuel || 100)
  const [notes, setNotes] = useState('')
  const [images, setImages] = useState([])
  const [findings, setFindings] = useState([])
  const [loadingAI, setLoadingAI] = useState(false)

  function handleImages(files) {
    setImages(files)
    setFindings([])
    if (!files || files.length===0) return
    setLoadingAI(true)
    // simulate AI
    setTimeout(()=>{
      const picks = []
      for (let i=0;i<Math.min(3, files.length); i++) {
        picks.push(mockFindings[(i) % mockFindings.length])
      }
      setFindings(picks)
      setLoadingAI(false)
    }, 2000)
  }

  function submit() {
    const report = {
      vehicle,
      date: new Date().toISOString(),
      mileage,
      fuel,
      notes,
      images,
      findings,
      recommendedAction: computeAction(findings)
    }
    onSave(report)
  }

  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-semibold">Return Inspection</div>
          <div className="text-sm text-slate-500">{vehicle.model} — {vehicle.reg}</div>
        </div>
        <div className="text-sm text-slate-600">Last inspected: {vehicle.lastInspection}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1">
          <label className="block text-sm text-slate-600">Mileage</label>
          <input type="number" value={mileage} onChange={e=>setMileage(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-400" />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Fuel Level</label>
          <select value={fuel} onChange={e=>setFuel(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-400">
            <option value={100}>Full</option>
            <option value={75}>75%</option>
            <option value={50}>50%</option>
            <option value={25}>25%</option>
            <option value={0}>Empty</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-600">Operator Notes</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="mt-1 h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-400" />
        </div>
      </div>

      <ImageUploader onChange={handleImages} />

      <div className="mt-4">
        <div className="text-sm font-medium mb-2">AI Damage Analysis</div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
          {loadingAI ? (
            <div className="flex items-center justify-center rounded-2xl bg-slate-50 p-6"> 
              <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <div className="ml-3 text-slate-600">Analyzing images…</div>
            </div>
          ) : (
            <FindingsList findings={findings} />
          )}
        </motion.div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">Cancel</button>
        <button onClick={submit} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">Save & Generate Report</button>
      </div>
    </div>
  )
}

function computeAction(findings){
  if (!findings || findings.length===0) return 'Available'
  if (findings.some(f=>f.action.includes('Repair'))) return 'Repair Required'
  if (findings.some(f=>f.action.includes('Cleaning'))) return 'Cleaning Required'
  return 'Available'
}
