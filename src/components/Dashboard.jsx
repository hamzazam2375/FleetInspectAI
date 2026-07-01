import React from 'react'
import { motion } from 'framer-motion'

export default function Dashboard({ vehicles, inspections, onInspect }) {
  const total = vehicles.length
  const available = vehicles.filter(v=>v.status==='Available').length
  const cleaning = vehicles.filter(v=>v.status==='Needs Cleaning').length
  const repair = vehicles.filter(v=>v.status==='Needs Repair').length

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Vehicles" value={total} color="indigo" />
        <Card title="Available" value={available} color="green" />
        <Card title="Needs Cleaning" value={cleaning} color="yellow" />
        <Card title="Needs Repair" value={repair} color="red" />
      </div>

      <motion.section initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Recent Inspections</h2>
          <button className="text-sm text-indigo-600">View all</button>
        </div>

        {inspections.length===0 ? (
          <div className="text-sm text-slate-500 py-6">No inspections yet — start an inspection from Vehicles.</div>
        ) : (
          <ul className="space-y-3">
            {inspections.slice(0,5).map((r,i)=>(
              <li key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.vehicle.model} — {r.vehicle.reg}</div>
                  <div className="text-xs text-slate-500">{new Date(r.date).toLocaleString()}</div>
                </div>
                <div className="text-sm text-slate-600">{r.recommendedAction}</div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vehicles.map(v=> (
            <motion.div key={v.id} whileHover={{scale:1.01}} className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div>
                <div className="font-medium">{v.model}</div>
                <div className="text-xs text-slate-500">{v.reg}</div>
              </div>
              <button onClick={()=>onInspect(v)} className="text-sm rounded-full bg-slate-900 px-3 py-2 text-white">Inspect</button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, color='indigo' }){
  const colors = {
    indigo: ['bg-indigo-50','text-indigo-700'],
    green: ['bg-green-50','text-green-700'],
    yellow: ['bg-yellow-50','text-yellow-700'],
    red: ['bg-red-50','text-red-700']
  }
  const [bg, text] = colors[color] || colors.indigo
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
      <div className={`${bg} p-3 rounded-full`}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`${text}`}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      </div>
    </div>
  )
}
