// data/seed-data.js - 20 Customers, 10 Drivers, 100 Sample Rides, 3 Admins, 1 Owner, Coupons, Tickets, Audit Logs

export function generateSeedData() {
  const customers = [
    { id: 'CUST-001', name: 'Aarav Patel', phone: '+91 98250 11001', email: 'aarav.patel@demo.in', loyaltyPoints: 240, referralCode: 'AARAV24', savedLocations: [{ name: 'Home', address: 'Bopal Cross Roads, Ahmedabad' }, { name: 'Work', address: 'Sindhu Bhavan Road, Ahmedabad' }] },
    { id: 'CUST-002', name: 'Priya Sharma', phone: '+91 98250 11002', email: 'priya.sharma@demo.in', loyaltyPoints: 420, referralCode: 'PRIYA42', savedLocations: [{ name: 'Home', address: 'Panchvati, Kalol' }, { name: 'Work', address: 'Infocity, Gandhinagar' }] },
    { id: 'CUST-003', name: 'Rohan Mehta', phone: '+91 98250 11003', email: 'rohan.mehta@demo.in', loyaltyPoints: 110, referralCode: 'ROHAN11', savedLocations: [{ name: 'Home', address: 'Satellite, Ahmedabad' }] },
    { id: 'CUST-004', name: 'Ananya Joshi', phone: '+91 98250 11004', email: 'ananya.joshi@demo.in', loyaltyPoints: 680, referralCode: 'ANANYA68', savedLocations: [{ name: 'Home', address: 'Sector 21, Gandhinagar' }] },
    { id: 'CUST-005', name: 'Kabir Desai', phone: '+91 98250 11005', email: 'kabir.desai@demo.in', loyaltyPoints: 95, referralCode: 'KABIR95', savedLocations: [{ name: 'Gym', address: 'Navrangpura, Ahmedabad' }] },
    { id: 'CUST-006', name: 'Diya Shah', phone: '+91 98250 11006', email: 'diya.shah@demo.in', loyaltyPoints: 310, referralCode: 'DIYA31', savedLocations: [{ name: 'College', address: 'Gujarat University, Ahmedabad' }] },
    { id: 'CUST-007', name: 'Devendra Vaghela', phone: '+91 98250 11007', email: 'dev.vaghela@demo.in', loyaltyPoints: 180, referralCode: 'DEV18', savedLocations: [{ name: 'Office', address: 'GIDC, Kalol' }] },
    { id: 'CUST-008', name: 'Isha Trivedi', phone: '+91 98250 11008', email: 'isha.trivedi@demo.in', loyaltyPoints: 500, referralCode: 'ISHA50', savedLocations: [{ name: 'Home', address: 'Vastrapur, Ahmedabad' }] },
    { id: 'CUST-009', name: 'Aditya Chauhan', phone: '+91 98250 11009', email: 'aditya.c@demo.in', loyaltyPoints: 70, referralCode: 'ADITYA7', savedLocations: [{ name: 'Home', address: 'Kudasan, Gandhinagar' }] },
    { id: 'CUST-010', name: 'Mira Parmar', phone: '+91 98250 11010', email: 'mira.parmar@demo.in', loyaltyPoints: 290, referralCode: 'MIRA29', savedLocations: [{ name: 'Studio', address: 'Prahlad Nagar, Ahmedabad' }] },
    { id: 'CUST-011', name: 'Harsh Vardhan', phone: '+91 98250 11011', email: 'harsh.v@demo.in', loyaltyPoints: 150, referralCode: 'HARSH15', savedLocations: [] },
    { id: 'CUST-012', name: 'Tanvi Dave', phone: '+91 98250 11012', email: 'tanvi.dave@demo.in', loyaltyPoints: 340, referralCode: 'TANVI34', savedLocations: [] },
    { id: 'CUST-013', name: 'Karan Barot', phone: '+91 98250 11013', email: 'karan.barot@demo.in', loyaltyPoints: 80, referralCode: 'KARAN8', savedLocations: [] },
    { id: 'CUST-014', name: 'Riddhi Soni', phone: '+91 98250 11014', email: 'riddhi.soni@demo.in', loyaltyPoints: 220, referralCode: 'RIDDHI22', savedLocations: [] },
    { id: 'CUST-015', name: 'Manish Solanki', phone: '+91 98250 11015', email: 'manish.s@demo.in', loyaltyPoints: 400, referralCode: 'MANISH40', savedLocations: [] },
    { id: 'CUST-016', name: 'Pooja Bhatt', phone: '+91 98250 11016', email: 'pooja.bhatt@demo.in', loyaltyPoints: 190, referralCode: 'POOJA19', savedLocations: [] },
    { id: 'CUST-017', name: 'Yashraj Jadeja', phone: '+91 98250 11017', email: 'yash.jadeja@demo.in', loyaltyPoints: 310, referralCode: 'YASH31', savedLocations: [] },
    { id: 'CUST-018', name: 'Neha Chokshi', phone: '+91 98250 11018', email: 'neha.c@demo.in', loyaltyPoints: 130, referralCode: 'NEHA13', savedLocations: [] },
    { id: 'CUST-019', name: 'Gautam Rao', phone: '+91 98250 11019', email: 'gautam.rao@demo.in', loyaltyPoints: 260, referralCode: 'GAUTAM26', savedLocations: [] },
    { id: 'CUST-020', name: 'Bhavna Rathod', phone: '+91 98250 11020', email: 'bhavna.r@demo.in', loyaltyPoints: 440, referralCode: 'BHAVNA44', savedLocations: [] }
  ];

  const drivers = [
    {
      id: 'DRV-001',
      name: 'Vikram Thakor',
      phone: '+91 97240 22001',
      avatar: '👨🏽',
      rating: 4.9,
      ratingCount: 384,
      category: 'standard',
      vehicle: { model: 'Bajaj Pulsar 150', regNo: 'GJ-18-AB-4021', color: 'Midnight Black', year: 2023 },
      isOnline: true,
      approvalStatus: 'Approved',
      hub: 'Kalol',
      lat: 23.2410,
      lng: 72.5020,
      totalEarnings: 38450,
      completedRides: 412,
      documents: { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' }
    },
    {
      id: 'DRV-002',
      name: 'Jignesh Prajapati',
      phone: '+91 97240 22002',
      avatar: '👨🏻',
      rating: 4.8,
      ratingCount: 290,
      category: 'premium',
      vehicle: { model: 'Royal Enfield Classic 350', regNo: 'GJ-01-KZ-9182', color: 'Chrome Bronze', year: 2024 },
      isOnline: true,
      approvalStatus: 'Approved',
      hub: 'Ahmedabad',
      lat: 23.0310,
      lng: 72.5640,
      totalEarnings: 42100,
      completedRides: 310,
      documents: { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' }
    },
    {
      id: 'DRV-003',
      name: 'Rakesh Makwana',
      phone: '+91 97240 22003',
      avatar: '👨🏾',
      rating: 4.95,
      ratingCount: 512,
      category: 'electric',
      vehicle: { model: 'Ather 450X Gen 3', regNo: 'GJ-18-EE-2045', color: 'Lunar Grey', year: 2024 },
      isOnline: true,
      approvalStatus: 'Approved',
      hub: 'Gandhinagar',
      lat: 23.2205,
      lng: 72.6410,
      totalEarnings: 51800,
      completedRides: 540,
      documents: { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' }
    },
    {
      id: 'DRV-004',
      name: 'Suresh Rabari',
      phone: '+91 97240 22004',
      avatar: '👨🏽',
      rating: 4.7,
      ratingCount: 220,
      category: 'heavy',
      vehicle: { model: 'Hero Splendor Pro Carrier', regNo: 'GJ-18-HH-7711', color: 'Steel Blue', year: 2022 },
      isOnline: true,
      approvalStatus: 'Approved',
      hub: 'Kalol',
      lat: 23.2350,
      lng: 72.4920,
      totalEarnings: 27900,
      completedRides: 245,
      documents: { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' }
    },
    {
      id: 'DRV-005',
      name: 'Mahesh Solanki',
      phone: '+91 97240 22005',
      avatar: '👨🏻',
      rating: 4.85,
      ratingCount: 310,
      category: 'scooter',
      vehicle: { model: 'Honda Activa 6G', regNo: 'GJ-01-SC-3344', color: 'Pearl White', year: 2023 },
      isOnline: true,
      approvalStatus: 'Approved',
      hub: 'Ahmedabad',
      lat: 23.0420,
      lng: 72.5830,
      totalEarnings: 33600,
      completedRides: 360,
      documents: { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' }
    },
    {
      id: 'DRV-006',
      name: 'Chetan Zala',
      phone: '+91 97240 22006',
      avatar: '👨🏽',
      rating: 4.9,
      ratingCount: 180,
      category: 'standard',
      vehicle: { model: 'TVS Apache RTR 160', regNo: 'GJ-18-TT-8802', color: 'Matte Blue', year: 2023 },
      isOnline: true,
      approvalStatus: 'Approved',
      hub: 'Gandhinagar',
      lat: 23.2120,
      lng: 72.6320,
      totalEarnings: 22100,
      completedRides: 195,
      documents: { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' }
    },
    {
      id: 'DRV-007',
      name: 'Bharat Vankar',
      phone: '+91 97240 22007',
      avatar: '👨🏾',
      rating: 4.75,
      ratingCount: 140,
      category: 'electric',
      vehicle: { model: 'Ola S1 Pro Gen 2', regNo: 'GJ-01-OL-1199', color: 'Coral Red', year: 2024 },
      isOnline: false,
      approvalStatus: 'Approved',
      hub: 'Ahmedabad',
      lat: 23.0180,
      lng: 72.5590,
      totalEarnings: 18400,
      completedRides: 155,
      documents: { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' }
    },
    {
      id: 'DRV-008',
      name: 'Ashok Dabhi',
      phone: '+91 97240 22008',
      avatar: '👨🏽',
      rating: 4.6,
      ratingCount: 88,
      category: 'scooter',
      vehicle: { model: 'TVS Jupiter 125', regNo: 'GJ-18-JJ-4521', color: 'Titanium Grey', year: 2023 },
      isOnline: true,
      approvalStatus: 'Approved',
      hub: 'Kalol',
      lat: 23.2425,
      lng: 72.5080,
      totalEarnings: 11200,
      completedRides: 98,
      documents: { licence: 'verified', rc: 'verified', insurance: 'verified', selfie: 'verified' }
    },
    {
      id: 'DRV-009',
      name: 'Dharmesh Rawal',
      phone: '+91 97240 22009',
      avatar: '👨🏻',
      rating: 0,
      ratingCount: 0,
      category: 'standard',
      vehicle: { model: 'Hero Glamour Xtec', regNo: 'GJ-01-HG-9011', color: 'Glossy Black', year: 2024 },
      isOnline: false,
      approvalStatus: 'Under Review',
      hub: 'Ahmedabad',
      lat: 23.0500,
      lng: 72.5600,
      totalEarnings: 0,
      completedRides: 0,
      documents: { licence: 'pending', rc: 'pending', insurance: 'pending', selfie: 'uploaded' }
    },
    {
      id: 'DRV-010',
      name: 'Pratik Gohel',
      phone: '+91 97240 22010',
      avatar: '👨🏽',
      rating: 0,
      ratingCount: 0,
      category: 'premium',
      vehicle: { model: 'KTM Duke 250', regNo: 'GJ-18-KD-1290', color: 'Electric Orange', year: 2024 },
      isOnline: false,
      approvalStatus: 'Resubmission Required',
      rejectionReason: 'RC document image is blurred and unreadable. Please upload a clear photo of the original RC card.',
      hub: 'Gandhinagar',
      lat: 23.2300,
      lng: 72.6500,
      totalEarnings: 0,
      completedRides: 0,
      documents: { licence: 'verified', rc: 'rejected', insurance: 'verified', selfie: 'verified' }
    }
  ];

  const admins = [
    { id: 'ADM-001', name: 'Kavita Iyer', email: 'admin@texsus.com', role: 'Super Admin', department: 'Operations' },
    { id: 'ADM-002', name: 'Sameer Sen', email: 'support@texsus.com', role: 'Support Lead', department: 'Customer Experience' },
    { id: 'ADM-003', name: 'Alok Nambiar', email: 'finance@texsus.com', role: 'Finance Admin', department: 'Accounts' }
  ];

  const owner = {
    id: 'OWNER-001',
    name: 'Vikramaditya Singhania',
    email: 'owner@texsus.com',
    role: 'Founder & CEO',
    title: 'Executive Platform Owner',
    organization: 'TEXSUS Mobility Private Limited'
  };

  const coupons = [
    { code: 'WELCOME50', discountType: 'percentage', value: 50, maxDiscount: 50, minRideAmount: 30, usageLimit: 1000, usedCount: 382, expiresAt: '2027-12-31', isActive: true, desc: '50% off on your first ride up to ₹50' },
    { code: 'FESTIVE25', discountType: 'flat', value: 25, maxDiscount: 25, minRideAmount: 50, usageLimit: 500, usedCount: 219, expiresAt: '2027-12-31', isActive: true, desc: 'Flat ₹25 discount for festive season' },
    { code: 'TEXSUSPRO', discountType: 'percentage', value: 20, maxDiscount: 100, minRideAmount: 100, usageLimit: 2000, usedCount: 843, expiresAt: '2027-12-31', isActive: true, desc: '20% off up to ₹100 on long rides' },
    { code: 'GUJARAT10', discountType: 'percentage', value: 10, maxDiscount: 30, minRideAmount: 40, usageLimit: 500, usedCount: 94, expiresAt: '2027-12-31', isActive: true, desc: 'Special 10% discount across Gujarat' }
  ];

  // Generate 100 sample rides with realistic distribution
  const hubs = ['Kalol', 'Ahmedabad', 'Gandhinagar'];
  const routesByHub = {
    Kalol: [
      { from: 'Panchvati Garden, Kalol', to: 'GIDC Industrial Area, Kalol', km: 4.8 },
      { from: 'Kalol Railway Station', to: 'Navjivan Mill Compound', km: 3.2 },
      { from: 'Kalol Tower Square', to: 'Vakharia High School, Kalol', km: 2.5 },
      { from: 'Kalol Bus Depot', to: 'Chhatral GIDC Highway', km: 8.4 }
    ],
    Ahmedabad: [
      { from: 'Vastrapur Lake, Ahmedabad', to: 'Sindhu Bhavan Road, Ahmedabad', km: 6.5 },
      { from: 'SG Highway, Bodakdev', to: 'Prahlad Nagar Corporate Park', km: 7.2 },
      { from: 'Gujarat University, Navrangpura', to: 'Maninagar Railway Station', km: 9.8 },
      { from: 'Shivranjani Cross Roads', to: 'Sabarmati Riverfront Walkway', km: 8.1 },
      { from: 'IIM Ahmedabad Road', to: 'Iskcon Cross Roads, SG Highway', km: 5.4 }
    ],
    Gandhinagar: [
      { from: 'Infocity Circle, Gandhinagar', to: 'Sector 21 Shopping Center', km: 5.6 },
      { from: 'Akshardham Temple, Gandhinagar', to: 'GIFT City Tower 1', km: 12.3 },
      { from: 'DAIICT College Gate', to: 'Mahatma Mandir Convention Centre', km: 6.8 },
      { from: 'Sector 11 Secretariat', to: 'Chiloda Highway Circle', km: 9.2 }
    ]
  };

  const categoriesList = ['standard', 'premium', 'electric', 'heavy', 'scooter'];
  const paymentMethods = ['UPI', 'Card', 'QR Code', 'Cash'];
  const rides = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 1; i <= 100; i++) {
    const rideId = `TXS-${1000 + i}`;
    const hub = hubs[i % hubs.length];
    const hubRoutes = routesByHub[hub];
    const route = hubRoutes[i % hubRoutes.length];
    const cust = customers[i % customers.length];
    const drv = drivers[i % 8]; // Pick from active approved drivers
    const cat = categoriesList[i % categoriesList.length];
    const distKm = parseFloat((route.km + ((i % 4) * 0.7)).toFixed(1));

    // Pricing calculation
    let base = 25;
    let perKm = 8;
    if (cat === 'premium') { base = 40; perKm = 12; }
    else if (cat === 'electric') { base = 30; perKm = 9; }
    else if (cat === 'heavy') { base = 50; perKm = 15; }
    else if (cat === 'scooter') { base = 20; perKm = 7; }

    const distanceFare = Math.round(distKm * perKm);
    const waitingMins = i % 7 === 0 ? 8 : 2;
    const waitingCharge = waitingMins > 3 ? (waitingMins - 3) * 1 : 0;
    const finalAmount = base + distanceFare + waitingCharge;
    const commission = 20; // fixed ₹20 platform commission
    const driverEarnings = finalAmount - commission;

    const isCancelled = i % 17 === 0;
    const isRefunded = isCancelled && (i % 2 === 0);
    const pMethod = paymentMethods[i % paymentMethods.length];
    const rideTimestamp = new Date(now - (100 - i) * (dayMs * 0.28)).toISOString();

    rides.push({
      id: rideId,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      driverId: drv.id,
      driverName: drv.name,
      driverPhone: drv.phone,
      category: cat,
      pickup: route.from,
      destination: route.to,
      stops: [],
      distanceKm: distKm,
      durationMins: Math.round(distKm * 2.8) + waitingMins,
      fare: {
        baseFare: base,
        distanceCharge: distanceFare,
        waitingCharge: waitingCharge,
        waitingMinutes: waitingMins,
        platformCommission: commission,
        finalAmount: isCancelled ? 0 : finalAmount,
        driverEarnings: isCancelled ? 0 : driverEarnings
      },
      payment: {
        method: pMethod,
        status: isCancelled ? (isRefunded ? 'Refunded' : 'N/A') : 'Paid',
        transactionId: `TXN-${880000 + i}`,
        paidAt: rideTimestamp
      },
      status: isCancelled ? 'Cancelled' : 'Completed',
      cancelReason: isCancelled ? 'Customer requested schedule adjustment' : null,
      rating: isCancelled ? null : (4 + (i % 2 ? 1 : 0.8)),
      review: isCancelled ? null : (i % 3 === 0 ? 'Prompt arrival and very polite driving!' : null),
      createdAt: rideTimestamp,
      hub: hub
    });
  }

  const supportTickets = [
    {
      id: 'TCK-1001',
      customerId: 'CUST-002',
      customerName: 'Priya Sharma',
      category: 'Payment',
      subject: 'Double deduction on UPI payment for TXS-1045',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Sameer Sen',
      createdAt: new Date(now - 3 * dayMs).toISOString(),
      messages: [
        { sender: 'customer', text: 'Hi, ₹78 was debited twice from my GPay account during ride TXS-1045.', time: '3 days ago' },
        { sender: 'admin', text: 'Hello Priya, we have verified the duplicate gateway ping and initiated an instant refund of ₹78.', time: '2 days ago' }
      ]
    },
    {
      id: 'TCK-1002',
      customerId: 'CUST-005',
      customerName: 'Kabir Desai',
      category: 'Ride',
      subject: 'Driver took longer detour via SG Highway',
      priority: 'Medium',
      status: 'Resolved',
      assignedTo: 'Sameer Sen',
      createdAt: new Date(now - 7 * dayMs).toISOString(),
      messages: [
        { sender: 'customer', text: 'Driver went around via Pakwan instead of direct road.', time: '7 days ago' },
        { sender: 'admin', text: 'Reviewed route telemetry. Heavy traffic congestion was reported on main avenue. Credit voucher of ₹25 applied.', time: '6 days ago' }
      ]
    },
    {
      id: 'TCK-1003',
      customerId: 'CUST-008',
      customerName: 'Isha Trivedi',
      category: 'Safety',
      subject: 'Driver was riding without proper helmet strap',
      priority: 'Critical',
      status: 'Under Investigation',
      assignedTo: 'Kavita Iyer',
      createdAt: new Date(now - 1 * dayMs).toISOString(),
      messages: [
        { sender: 'customer', text: 'The driver offered me a helmet but his own chin strap was unbuckled.', time: '1 day ago' },
        { sender: 'admin', text: 'Safety incident logged with Driver ID. Driver summoned for physical equipment check.', time: '18 hours ago' }
      ]
    }
  ];

  const auditLogs = [
    { id: 'LOG-001', user: 'admin@texsus.com', action: 'Approved Driver DRV-006 (Chetan Zala)', timestamp: new Date(now - 14 * dayMs).toISOString(), ip: '192.168.1.42' },
    { id: 'LOG-002', user: 'admin@texsus.com', action: 'Updated Electric category per-km rate to ₹9', timestamp: new Date(now - 10 * dayMs).toISOString(), ip: '192.168.1.42' },
    { id: 'LOG-003', user: 'finance@texsus.com', action: 'Processed refund ₹78 for ride TXS-1045', timestamp: new Date(now - 2 * dayMs).toISOString(), ip: '192.168.1.88' },
    { id: 'LOG-004', user: 'owner@texsus.com', action: 'Exported quarterly fiscal summary report', timestamp: new Date(now - 1 * dayMs).toISOString(), ip: '192.168.1.1' }
  ];

  return {
    customers,
    drivers,
    admins,
    owner,
    rides,
    coupons,
    supportTickets,
    auditLogs
  };
}
