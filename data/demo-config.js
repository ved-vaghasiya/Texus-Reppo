// data/demo-config.js - Default pricing, cancellation, cities, categories

export const DEMO_CONFIG = {
  appName: 'TEXSUS',
  tagline: 'Ride Beyond Limits.',
  currency: '₹',
  defaultLanguage: 'en',
  defaultTheme: 'dark',
  commissionFixed: 20, // ₹20 fixed platform commission per completed ride

  // Category specifications & initial pricing
  categories: {
    standard: {
      id: 'standard',
      name: 'Standard Bike',
      capacity: 1,
      baseFare: 25,
      perKm: 8,
      etaMins: 3,
      desc: 'Swift & economical everyday commuting on 125-150cc bikes.',
      icon: 'bike',
      color: '#9d00ff'
    },
    premium: {
      id: 'premium',
      name: 'Premium Cruiser',
      capacity: 1,
      baseFare: 40,
      perKm: 12,
      etaMins: 5,
      desc: 'Top-tier comfort on Royal Enfield & 250cc+ highway cruisers.',
      icon: 'zap',
      color: '#00f2fe'
    },
    electric: {
      id: 'electric',
      name: 'Electric Eco-Bike',
      capacity: 1,
      baseFare: 30,
      perKm: 9,
      etaMins: 4,
      desc: 'Zero-emission silent ride with instant torque (Ather/Ola/Chetak).',
      icon: 'award',
      color: '#00e676'
    },
    heavy: {
      id: 'heavy',
      name: 'Heavy Luggage Carrier',
      capacity: 1,
      baseFare: 50,
      perKm: 15,
      etaMins: 6,
      desc: 'Equipped with heavy-duty rear carrier rack for luggage up to 25kg.',
      icon: 'layers',
      color: '#ffb300'
    },
    scooter: {
      id: 'scooter',
      name: 'Zip Scooter',
      capacity: 1,
      baseFare: 20,
      perKm: 7,
      etaMins: 3,
      desc: 'Easy step-through comfort, ideal for quick short-distance hops.',
      icon: 'navigation',
      color: '#ff4081'
    }
  },

  // Waiting Charges
  waitingRules: {
    freeMinutes: 3,
    perMinuteRate: 1 // ₹1/min after 3 mins
  },

  // Cancellation Policy
  cancellationRules: {
    freeWindowMinutes: 3,
    customerCancelFee: 30, // ₹30 after 3 mins
    noShowFee: 50,         // ₹50 customer no-show
    driverCancelFee: 0     // Free for customer on driver cancel
  },

  // Demo Operational Hubs
  hubs: {
    kalol: { name: 'Kalol Hub', lat: 23.2384, lng: 72.4988, state: 'Gujarat' },
    ahmedabad: { name: 'Ahmedabad Central', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
    gandhinagar: { name: 'Gandhinagar Infocity', lat: 23.2156, lng: 72.6369, state: 'Gujarat' }
  }
};
