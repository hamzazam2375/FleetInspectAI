import React from 'react'

export default function Sidebar({ view, setView }){
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 hidden md:block">
      <div className="mb-8">
        <div className="text-lg font-semibold text-indigo-600">FleetInspect AI</div>
        <div className="text-xs text-slate-500">Vehicle return inspections</div>
      </div>

      <nav className="space-y-2">
        <NavItem active={view==='dashboard'} onClick={()=>setView('dashboard')}>Dashboard</NavItem>
        <NavItem active={view==='vehicles'} onClick={()=>setView('vehicles')}>Vehicles</NavItem>
        <NavItem active={view==='inspection'} onClick={()=>setView('inspection')}>Start Inspection</NavItem>
      </nav>

      <div className="mt-8 text-xs text-slate-500">
        <div>Tip: Click a vehicle card to start an inspection quickly.</div>
      </div>
    </aside>
  )
}

function NavItem({ children, active, onClick }){
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-2 rounded ${active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
      {children}
    </button>
  )
}
