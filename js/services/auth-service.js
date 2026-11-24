// js/services/auth-service.js - Role guards, demo credentials, OTP & Google simulations

import { store } from '../storage/store.js';

export const AuthService = {
  // Demo Credentials Directory (Prompt Section 6)
  getDemoCredentials() {
    return {
      customer: {
        title: 'Customer Demo',
        phone: '+91 98250 11001',
        name: 'Aarav Patel',
        demoOtp: '4021',
        note: 'Instant booking, OTP verification, live 3D tracking'
      },
      driver: {
        title: 'Driver Demo',
        phone: '+91 97240 22001',
        name: 'Vikram Thakor',
        demoOtp: '4021',
        note: 'Bajaj Pulsar 150 (GJ-18-AB-4021), 30s request acceptance'
      },
      admin: {
        title: 'Admin Demo',
        email: 'admin@texsus.com',
        pass: 'admin123',
        name: 'Kavita Iyer (Operations Lead)',
        note: 'Manage drivers, fares, commissions, coupons, support'
      },
      owner: {
        title: 'Owner Demo',
        email: 'owner@texsus.com',
        pass: 'owner123',
        name: 'Vikramaditya Singhania (CEO)',
        note: 'Executive financial charts, platform GMV, admin manager'
      }
    };
  },

  // Simulated OTP Generation
  generateOtp(phone) {
    return '4021'; // Fixed demo OTP for convenience, auto-filled or user typed
  },

  // Verify OTP
  verifyOtp(phone, enteredOtp) {
    return enteredOtp === '4021' || enteredOtp.length === 4;
  },

  // Quick Demo Access Login (One-click)
  loginAsDemoRole(role) {
    if (role === 'customer') {
      const customers = store.get('customers', []);
      const user = customers[0] || { id: 'CUST-001', name: 'Aarav Patel', phone: '+91 98250 11001' };
      store.setSession('customer', user);
      store.logAudit(`Customer demo login: ${user.name}`);
      return user;
    } 
    else if (role === 'driver') {
      const drivers = store.get('drivers', []);
      const user = drivers[0] || { id: 'DRV-001', name: 'Vikram Thakor', phone: '+91 97240 22001' };
      store.setSession('driver', user);
      store.logAudit(`Driver demo login: ${user.name}`);
      return user;
    }
    else if (role === 'admin') {
      const admins = store.get('admins', []);
      const user = admins[0] || { id: 'ADM-001', name: 'Kavita Iyer', email: 'admin@texsus.com' };
      store.setSession('admin', user);
      store.logAudit(`Admin demo login: ${user.name}`);
      return user;
    }
    else if (role === 'owner') {
      const owner = store.get('owner', { id: 'OWNER-001', name: 'Vikramaditya Singhania', email: 'owner@texsus.com' });
      store.setSession('owner', owner);
      store.logAudit(`Owner executive login: ${owner.name}`);
      return owner;
    }
  },

  // Google Sign-In Simulation
  simulateGoogleLogin() {
    const googleProfile = {
      id: 'CUST-G01',
      name: 'Aarav Patel (Google)',
      email: 'aarav.patel.google@gmail.com',
      avatar: '👨🏽',
      loyaltyPoints: 350,
      referralCode: 'AARAVG9'
    };
    store.setSession('customer', googleProfile);
    store.logAudit('Simulated Google Authentication success');
    return googleProfile;
  },

  // Check Role Guards
  canAccess(requestedRole) {
    const currentRole = store.getCurrentRole();
    return currentRole === requestedRole;
  }
};
