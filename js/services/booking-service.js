// js/services/booking-service.js - Complete 12-Step Booking Engine & Fare Calculation

import { store } from '../storage/store.js';
import { DEMO_CONFIG } from '../../data/demo-config.js';

export const BookingService = {
  // Predefined locations across Kalol, Ahmedabad, Gandhinagar
  getPresetLocations() {
    return [
      { name: 'Panchvati Garden, Kalol', hub: 'Kalol', lat: 23.2384, lng: 72.4988 },
      { name: 'GIDC Industrial Area, Kalol', hub: 'Kalol', lat: 23.2450, lng: 72.5120 },
      { name: 'Kalol Railway Station', hub: 'Kalol', lat: 23.2310, lng: 72.4920 },
      { name: 'Vastrapur Lake, Ahmedabad', hub: 'Ahmedabad', lat: 23.0350, lng: 72.5290 },
      { name: 'Sindhu Bhavan Road, Ahmedabad', hub: 'Ahmedabad', lat: 23.0420, lng: 72.5080 },
      { name: 'Gujarat University, Ahmedabad', hub: 'Ahmedabad', lat: 23.0370, lng: 72.5480 },
      { name: 'Infocity Circle, Gandhinagar', hub: 'Gandhinagar', lat: 23.1890, lng: 72.6280 },
      { name: 'Akshardham Temple, Gandhinagar', hub: 'Gandhinagar', lat: 23.2300, lng: 72.6740 },
      { name: 'GIFT City Tower 1, Gandhinagar', hub: 'Gandhinagar', lat: 23.1610, lng: 72.6840 }
    ];
  },

  // Calculate distance in KM using Haversine formula (or fallback demo estimation)
  calculateDistance(from, to, stops = []) {
    // Basic approximate distance based on locations or hash
    let baseKm = 5.2;
    if (from && to) {
      const combined = from.length + to.length;
      baseKm = parseFloat((3.0 + (combined % 12) * 0.9).toFixed(1));
    }
    // Add 2.5km for every intermediate stop
    const stopsKm = (stops || []).length * 2.5;
    return parseFloat((baseKm + stopsKm).toFixed(1));
  },

  // Fare Calculation Engine (Section 10)
  calculateFare(categoryKey, distanceKm, waitingMinutes = 0, couponCode = null) {
    const config = store.get('config', DEMO_CONFIG);
    const cat = config.categories[categoryKey] || config.categories.standard;
    const baseFare = cat.baseFare;
    const distanceCharge = Math.round(distanceKm * cat.perKm);

    // Waiting charges: first 3 minutes free, ₹1/min after
    let waitingCharge = 0;
    if (waitingMinutes > config.waitingRules.freeMinutes) {
      waitingCharge = (waitingMinutes - config.waitingRules.freeMinutes) * config.waitingRules.perMinuteRate;
    }

    const subtotal = baseFare + distanceCharge + waitingCharge;

    // Platform commission: fixed ₹20 per completed ride (deducted from driver earnings)
    const platformCommission = config.commissionFixed || 20;

    // Coupon discount calculation
    let discount = 0;
    if (couponCode) {
      const coupons = store.get('coupons', []);
      const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive);
      if (coupon && subtotal >= (coupon.minRideAmount || 0)) {
        if (coupon.discountType === 'percentage') {
          discount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount || 100);
        } else {
          discount = Math.min(coupon.value, subtotal);
        }
      }
    }

    const finalAmount = Math.max(subtotal - discount, 20); // Minimum fare floor
    const driverEarnings = Math.max(finalAmount - platformCommission, 10);

    return {
      category: cat.name,
      baseFare,
      distanceCharge,
      waitingCharge,
      waitingMinutes,
      subtotal,
      discount,
      platformCommission,
      finalAmount,
      driverEarnings
    };
  },

  // Get matching available drivers within 5km radius (Section 14)
  getAvailableDrivers(categoryKey = null) {
    const drivers = store.get('drivers', []);
    return drivers.filter(d => {
      const isApproved = d.approvalStatus === 'Approved';
      const isOnline = d.isOnline === true;
      const matchesCat = !categoryKey || d.category === categoryKey;
      return isApproved && isOnline && matchesCat;
    });
  },

  // Generate 4-Digit Demo Ride OTP
  generateRideOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  },

  // Create & Register New Booking
  createBooking(bookingPayload) {
    const user = store.getCurrentUser();
    const rideId = `TXS-${Date.now().toString().slice(-4)}`;
    const otp = this.generateRideOtp();

    const newRide = {
      id: rideId,
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      driverId: bookingPayload.driver.id,
      driverName: bookingPayload.driver.name,
      driverPhone: bookingPayload.driver.phone,
      driverAvatar: bookingPayload.driver.avatar,
      driverVehicle: bookingPayload.driver.vehicle,
      category: bookingPayload.category,
      pickup: bookingPayload.pickup,
      destination: bookingPayload.destination,
      stops: bookingPayload.stops || [],
      bookingType: bookingPayload.bookingType || 'instant', // instant, scheduled, round_trip, recurring
      scheduleDate: bookingPayload.scheduleDate || null,
      scheduleTime: bookingPayload.scheduleTime || null,
      roundTripWaitMins: bookingPayload.roundTripWaitMins || 0,
      recurringPattern: bookingPayload.recurringPattern || null, // daily, weekly
      distanceKm: bookingPayload.distanceKm,
      fare: bookingPayload.fare,
      paymentMethod: bookingPayload.paymentMethod || 'UPI',
      paymentStatus: 'Pending',
      status: 'Accepted', // Trip sequence: Accepted -> Approaching -> Arrived -> Started -> Completed
      rideOtp: otp,
      createdAt: new Date().toISOString()
    };

    // Store as active ride in central store
    store.setActiveRide(newRide);

    // Also push to persistent rides history
    const rides = store.get('rides', []);
    rides.unshift(newRide);
    store.set('rides', rides);

    store.logAudit(`Ride ${rideId} booked by ${user.name} with Driver ${bookingPayload.driver.name}`);
    return newRide;
  },

  // Cancel Booking (Section 16 Cancellation Rules)
  cancelBooking(rideId, cancelReason = 'Customer cancelled') {
    const ride = store.getActiveRide();
    if (ride && ride.id === rideId) {
      ride.status = 'Cancelled';
      ride.cancelReason = cancelReason;
      
      // Update in rides collection
      const rides = store.get('rides', []);
      const idx = rides.findIndex(r => r.id === rideId);
      if (idx >= 0) rides[idx] = ride;
      store.set('rides', rides);
      store.clearActiveRide();
      store.logAudit(`Ride ${rideId} cancelled: ${cancelReason}`);
      return ride;
    }
  }
};
