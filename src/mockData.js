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

// Pre-trip findings — baseline issues that already exist on the car
export const preTripFindingsPool = [
  { title: 'Minor Scratch on Driver Side Door', confidence: 0.82, severity: 'Minor', action: 'Pre-existing' },
  { title: 'Small Dent on Front Bumper', confidence: 0.74, severity: 'Minor', action: 'Pre-existing' },
  { title: 'Light Scuff on Rear Quarter Panel', confidence: 0.69, severity: 'Low', action: 'Pre-existing' },
  { title: 'Faded Paint on Hood Edge', confidence: 0.61, severity: 'Low', action: 'Pre-existing' },
  { title: 'Tiny Chip on Windshield Edge', confidence: 0.58, severity: 'Minor', action: 'Pre-existing' }
]

// Post-trip findings — includes some that overlap with pre-trip (pre-existing) and some new
export const postTripFindingsPool = [
  { title: 'Minor Scratch on Driver Side Door', confidence: 0.85, severity: 'Minor', action: 'Pre-existing' },
  { title: 'Small Dent on Front Bumper', confidence: 0.78, severity: 'Minor', action: 'Pre-existing' },
  { title: 'New Deep Scratch on Passenger Door', confidence: 0.91, severity: 'Major', action: 'Repair Required' },
  { title: 'New Dent Detected on Rear Bumper', confidence: 0.88, severity: 'Minor', action: 'Repair Required' },
  { title: 'Stain Detected on Back Seat Fabric', confidence: 0.72, severity: 'Low', action: 'Cleaning Required' },
  { title: 'Cracked Side Mirror Housing', confidence: 0.83, severity: 'Major', action: 'Repair Required' },
  { title: 'Curb Rash on Front Right Wheel', confidence: 0.76, severity: 'Minor', action: 'Repair Required' }
]

// ─── Dummy booking generator ───

const dummyCustomers = [
  { name: 'Sophia Williams', email: 'sophia.w@email.com', phone: '+1 (555) 901-2345' },
  { name: 'Liam Anderson', email: 'liam.a@email.com', phone: '+1 (555) 234-5678' },
  { name: 'Emma Thompson', email: 'emma.t@email.com', phone: '+1 (555) 567-8901' },
  { name: 'Noah Garcia', email: 'noah.g@email.com', phone: '+1 (555) 345-6789' },
  { name: 'Ava Martinez', email: 'ava.m@email.com', phone: '+1 (555) 789-0123' },
  { name: 'Ethan Brown', email: 'ethan.b@email.com', phone: '+1 (555) 123-4567' },
  { name: 'Isabella Davis', email: 'isabella.d@email.com', phone: '+1 (555) 456-7890' },
  { name: 'Mason Wilson', email: 'mason.w@email.com', phone: '+1 (555) 678-9012' },
  { name: 'Mia Taylor', email: 'mia.t@email.com', phone: '+1 (555) 012-3456' },
  { name: 'Lucas Moore', email: 'lucas.m@email.com', phone: '+1 (555) 890-1234' }
]

const dummyLocations = [
  'Downtown Hub — 42 King St',
  'Airport Terminal 2',
  'Midtown Office — 118 Park Ave',
  'Westside Branch — 305 Oak Blvd',
  'Harbor Point — 12 Marine Dr'
]

const dummyNotes = [
  'Customer requested child seat.',
  'Business trip rental.',
  'Weekend getaway — extra insurance added.',
  'Repeat customer — loyalty discount applied.',
  'GPS unit requested.',
  'Early morning pickup.',
  'Late return expected — customer notified.',
  ''
]

let bookingCounter = 1006

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

export function generateDummyBooking() {
  bookingCounter++
  const customer = randomPick(dummyCustomers)
  const vehicle = randomPick(vehicles)
  const pickup = randomDate(-Math.floor(Math.random() * 5))
  const returnDays = 3 + Math.floor(Math.random() * 10)
  const returnDate = randomDate(returnDays)
  const cost = Math.round((50 + Math.random() * 80) * returnDays)
  const deposit = Math.round(cost * 0.3)

  return {
    id: `BKG-${bookingCounter}`,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    vehicleId: vehicle.id,
    vehicleModel: vehicle.model,
    vehicleReg: vehicle.reg,
    pickupDate: pickup,
    returnDate: returnDate,
    pickupLocation: randomPick(dummyLocations),
    status: 'Active',
    totalCost: cost,
    deposit: deposit,
    notes: randomPick(dummyNotes),
    preTripImages: [],
    postTripImages: [],
    preTripFindings: [],
    postTripFindings: [],
    comparisonReport: null
  }
}

// Default bookings seeded into the app
export const mockBookings = [
  {
    id: 'BKG-1001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1 (555) 234-8901',
    vehicleId: 'VHC-001',
    vehicleModel: 'Toyota Corolla',
    vehicleReg: 'ABC-1234',
    pickupDate: '2026-06-25',
    returnDate: '2026-07-03',
    pickupLocation: 'Downtown Hub — 42 King St',
    status: 'Active',
    totalCost: 385.00,
    deposit: 150.00,
    notes: 'Customer requested child seat.',
    preTripImages: [],
    postTripImages: [],
    preTripFindings: [
      { title: 'Minor Scratch on Driver Side Door', confidence: 0.82, severity: 'Minor', action: 'Pre-existing' },
      { title: 'Light Scuff on Rear Quarter Panel', confidence: 0.69, severity: 'Low', action: 'Pre-existing' }
    ],
    postTripFindings: [],
    comparisonReport: null
  },
  {
    id: 'BKG-1002',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@email.com',
    customerPhone: '+1 (555) 678-1234',
    vehicleId: 'VHC-002',
    vehicleModel: 'Honda Civic',
    vehicleReg: 'DEF-5678',
    pickupDate: '2026-06-20',
    returnDate: '2026-07-01',
    pickupLocation: 'Airport Terminal 2',
    status: 'Returned',
    totalCost: 520.00,
    deposit: 200.00,
    notes: 'Long-term rental, business trip.',
    preTripImages: [],
    postTripImages: [],
    preTripFindings: [
      { title: 'Small Dent on Front Bumper', confidence: 0.74, severity: 'Minor', action: 'Pre-existing' },
      { title: 'Faded Paint on Hood Edge', confidence: 0.61, severity: 'Low', action: 'Pre-existing' }
    ],
    postTripFindings: [],
    comparisonReport: null
  },
  {
    id: 'BKG-1003',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.r@email.com',
    customerPhone: '+1 (555) 456-7890',
    vehicleId: 'VHC-003',
    vehicleModel: 'Hyundai Elantra',
    vehicleReg: 'GHI-9012',
    pickupDate: '2026-07-01',
    returnDate: '2026-07-05',
    pickupLocation: 'Midtown Office — 118 Park Ave',
    status: 'Active',
    totalCost: 220.00,
    deposit: 100.00,
    notes: 'Weekend getaway.',
    preTripImages: [],
    postTripImages: [],
    preTripFindings: [
      { title: 'Tiny Chip on Windshield Edge', confidence: 0.58, severity: 'Minor', action: 'Pre-existing' }
    ],
    postTripFindings: [],
    comparisonReport: null
  },
  {
    id: 'BKG-1004',
    customerName: 'David Kim',
    customerEmail: 'dkim@email.com',
    customerPhone: '+1 (555) 321-6543',
    vehicleId: 'VHC-004',
    vehicleModel: 'Kia Sportage',
    vehicleReg: 'JKL-3456',
    pickupDate: '2026-06-28',
    returnDate: '2026-07-10',
    pickupLocation: 'Downtown Hub — 42 King St',
    status: 'Active',
    totalCost: 680.00,
    deposit: 250.00,
    notes: 'Family vacation — needs GPS unit.',
    preTripImages: [],
    postTripImages: [],
    preTripFindings: [
      { title: 'Minor Scratch on Driver Side Door', confidence: 0.82, severity: 'Minor', action: 'Pre-existing' },
      { title: 'Small Dent on Front Bumper', confidence: 0.74, severity: 'Minor', action: 'Pre-existing' }
    ],
    postTripFindings: [],
    comparisonReport: null
  },
  {
    id: 'BKG-1005',
    customerName: 'Olivia Martinez',
    customerEmail: 'olivia.m@email.com',
    customerPhone: '+1 (555) 890-4567',
    vehicleId: 'VHC-001',
    vehicleModel: 'Toyota Corolla',
    vehicleReg: 'ABC-1234',
    pickupDate: '2026-06-10',
    returnDate: '2026-06-18',
    pickupLocation: 'Airport Terminal 2',
    status: 'Completed',
    totalCost: 440.00,
    deposit: 150.00,
    notes: '',
    preTripImages: [],
    postTripImages: [],
    preTripFindings: [
      { title: 'Light Scuff on Rear Quarter Panel', confidence: 0.69, severity: 'Low', action: 'Pre-existing' }
    ],
    postTripFindings: [
      { title: 'Light Scuff on Rear Quarter Panel', confidence: 0.72, severity: 'Low', action: 'Pre-existing' },
      { title: 'New Deep Scratch on Passenger Door', confidence: 0.91, severity: 'Major', action: 'Repair Required' }
    ],
    comparisonReport: {
      preExisting: [{ title: 'Light Scuff on Rear Quarter Panel', severity: 'Low' }],
      newDamage: [{ title: 'New Deep Scratch on Passenger Door', severity: 'Major', action: 'Repair Required' }],
      resolved: []
    }
  },
  {
    id: 'BKG-1006',
    customerName: 'James Patel',
    customerEmail: 'j.patel@email.com',
    customerPhone: '+1 (555) 112-3344',
    vehicleId: 'VHC-002',
    vehicleModel: 'Honda Civic',
    vehicleReg: 'DEF-5678',
    pickupDate: '2026-06-05',
    returnDate: '2026-06-12',
    pickupLocation: 'Midtown Office — 118 Park Ave',
    status: 'Completed',
    totalCost: 365.00,
    deposit: 150.00,
    notes: 'Repeat customer — loyalty discount applied.',
    preTripImages: [],
    postTripImages: [],
    preTripFindings: [
      { title: 'Minor Scratch on Driver Side Door', confidence: 0.82, severity: 'Minor', action: 'Pre-existing' },
      { title: 'Faded Paint on Hood Edge', confidence: 0.61, severity: 'Low', action: 'Pre-existing' }
    ],
    postTripFindings: [
      { title: 'Minor Scratch on Driver Side Door', confidence: 0.85, severity: 'Minor', action: 'Pre-existing' },
      { title: 'Faded Paint on Hood Edge', confidence: 0.63, severity: 'Low', action: 'Pre-existing' }
    ],
    comparisonReport: {
      preExisting: [
        { title: 'Minor Scratch on Driver Side Door', severity: 'Minor' },
        { title: 'Faded Paint on Hood Edge', severity: 'Low' }
      ],
      newDamage: [],
      resolved: []
    }
  }
]
