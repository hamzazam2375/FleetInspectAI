import React from 'react'
import { motion } from 'framer-motion'

export default function VehicleList({ vehicles, onInspect }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-2">Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map(v=> (
          <motion.div key={v.id} whileHover={{scale:1.01}} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold">{v.model}</div>
                  <div className="text-sm text-slate-500">{v.reg}</div>
                </div>
                <StatusBadge status={v.status} />
              </div>
              <div className="text-xs text-slate-500 mb-3">Last inspected: {v.lastInspection}</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-slate-500">Mileage: <span className="font-medium">{v.mileage}</span></div>
              <button onClick={()=>onInspect(v)} className="rounded-full bg-slate-900 px-3 py-2 text-sm text-white">Inspect</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }){
  const color = status==='Available' ? 'bg-green-100 text-green-800' : status==='Needs Cleaning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
  return <span className={`px-2 py-1 text-xs rounded ${color}`}>{status}</span>
}
