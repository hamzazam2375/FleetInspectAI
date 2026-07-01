import React from 'react'

export default function FindingsList({ findings }){
  if (!findings || findings.length===0) return <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-500">No findings detected yet.</div>
  return (
    <div className="space-y-3">
      {findings.map((f,i)=>(
        <div key={i} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{f.title}</div>
              <div className="text-xs text-slate-500">Severity: {f.severity}</div>
            </div>
            <div className="text-sm font-medium text-slate-700">{(f.confidence*100).toFixed(0)}%</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div style={{width: `${Math.round(f.confidence*100)}%`}} className="h-full rounded-full bg-slate-900" />
          </div>
        </div>
      ))}
    </div>
  )
}
