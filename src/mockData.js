export const vehicles = [
  {
    id: 'VHC-001',
    model: 'Toyota Corolla',
    reg: 'ABC-1234',
    status: 'Available',
    lastInspection: '2026-06-08',
    mileage: 45200,
    fuel: 75
  },
  {
    id: 'VHC-002',
    model: 'Honda Civic',
    reg: 'DEF-5678',
    status: 'Needs Cleaning',
    lastInspection: '2026-06-10',
    mileage: 38940,
    fuel: 40
  },
  {
    id: 'VHC-003',
    model: 'Hyundai Elantra',
    reg: 'GHI-9012',
    status: 'Needs Repair',
    lastInspection: '2026-05-28',
    mileage: 50210,
    fuel: 60
  },
  {
    id: 'VHC-004',
    model: 'Kia Sportage',
    reg: 'JKL-3456',
    status: 'Available',
    lastInspection: '2026-06-01',
    mileage: 27500,
    fuel: 90
  }
]

export const mockFindings = [
  { title: 'Potential Scratch Detected on Front Door', confidence: 0.87, severity: 'Minor', action: 'Repair Required' },
  { title: 'Minor Dent Detected on Rear Bumper', confidence: 0.73, severity: 'Minor', action: 'Repair Required' },
  { title: 'Stain Detected on Rear Seat', confidence: 0.66, severity: 'Low', action: 'Cleaning Required' },
  { title: 'Broken Tail Light Possible', confidence: 0.59, severity: 'Major', action: 'Repair Required' }
]
