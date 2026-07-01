import React, { useRef, useState } from 'react'

export default function ImageUploader({ onChange }){
  const fileRef = useRef()
  const [previews, setPreviews] = useState([])

  function handleFiles(e){
    const files = Array.from(e.target.files)
    const mapped = files.map(f=>({ file: f, url: URL.createObjectURL(f) }))
    setPreviews(prev=>[...prev, ...mapped])
    onChange(mapped)
  }

  function remove(i){
    setPreviews(prev=>{
      const next = [...prev]
      next.splice(i,1)
      return next
    })
    // notify parent with remaining previews
    const remaining = previews.filter((_,idx)=>idx!==i)
    onChange(remaining)
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
      <label className="block text-sm font-medium text-slate-700 mb-3">Upload Vehicle Images</label>
      <div className="flex flex-wrap items-center gap-3">
        <input ref={fileRef} multiple type="file" accept="image/*" onChange={handleFiles} className="text-sm text-slate-500" />
        <button onClick={()=>fileRef.current && fileRef.current.click()} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">Choose Files</button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {previews.map((p,i)=> (
          <div key={i} className="relative">
            <img src={p.url} alt={`preview-${i}`} className="h-28 w-full rounded-xl object-cover" />
            <button onClick={()=>remove(i)} className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs text-slate-700 shadow">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
