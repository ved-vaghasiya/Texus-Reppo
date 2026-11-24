// js/storage/store.js - Centralized LocalStorage Data Engine with Reactive Event Bus

import { generateSeedData } from '../../data/seed-data.js';
import { DEMO_CONFIG } from '../../data/demo-config.js';

const STORAGE_PREFIX = 'texsus_pwa_';

class CentralStore {
  constructor() {
    this.subscribers = new Map();
    this.init();
  }

  init() {
    try {
      const seeded = localStorage.getItem(`${STORAGE_PREFIX}seeded_v1`);
      if (!seeded) {
        this.seed();
      }
    } catch (e) {
      console.warn('LocalStorage access issue:', e);
    }
  }

  seed() {
    const data = generateSeedData();
    localStorage.setItem(`${STORAGE_PREFIX}customers`, JSON.stringify(data.customers));
    localStorage.setItem(`${STORAGE_PREFIX}drivers`, JSON.stringify(data.drivers));
    localStorage.setItem(`${STORAGE_PREFIX}admins`, JSON.stringify(data.admins));
    localStorage.setItem(`${STORAGE_PREFIX}owner`, JSON.stringify(data.owner));
    localStorage.setItem(`${STORAGE_PREFIX}rides`, JSON.stringify(data.rides));
    localStorage.setItem(`${STORAGE_PREFIX}coupons`, JSON.stringify(data.coupons));
    localStorage.setItem(`${STORAGE_PREFIX}supportTickets`, JSON.stringify(data.supportTickets));
    localStorage.setItem(`${STORAGE_PREFIX}auditLogs`, JSON.stringify(data.auditLogs));
    localStorage.setItem(`${STORAGE_PREFIX}config`, JSON.stringify(DEMO_CONFIG));
    
    // Default active session: customer Aarav Patel
    if (!this.getCurrentRole()) {
      this.setSession('customer', data.customers[0]);
    }
    
    localStorage.setItem(`${STORAGE_PREFIX}seeded_v1`, 'true');
    this.emit('store:seeded');
  }

  reset() {
    const role = this.getCurrentRole();
    const user = this.getCurrentUser();
    localStorage.clear();
    this.seed();
    if (role && user) {
      this.setSession(role, user);
    }
    this.emit('store:reset');
  }

  clear() {
    localStorage.clear();
    this.emit('store:cleared');
  }

  get(collection, defaultValue = []) {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${collection}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading collection ${collection}:`, e);
      return defaultValue;
    }
  }

  set(collection, value) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${collection}`, JSON.stringify(value));
      this.emit(`change:${collection}`, value);
      this.emit('change:*', { collection, value });
    } catch (e) {
      console.error(`Error setting collection ${collection}:`, e);
    }
  }

  findById(collection, id) {
    const list = this.get(collection, []);
    return list.find(item => item.id === id);
  }

  upsert(collection, item) {
    const list = this.get(collection, []);
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...item };
    } else {
      list.unshift(item);
    }
    this.set(collection, list);
    return item;
  }

  remove(collection, id) {
    const list = this.get(collection, []);
    const updated = list.filter(i => i.id !== id);
    this.set(collection, updated);
  }

  // Session & Role management
  setSession(role, user) {
    localStorage.setItem(`${STORAGE_PREFIX}session_role`, role);
    localStorage.setItem(`${STORAGE_PREFIX}session_user`, JSON.stringify(user));
    this.emit('auth:change', { role, user });
  }

  getCurrentRole() {
    return localStorage.getItem(`${STORAGE_PREFIX}session_role`) || 'customer';
  }

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}session_user`);
      if (raw) return JSON.parse(raw);
      // Fallback
      const customers = this.get('customers', []);
      return customers[0] || null;
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem(`${STORAGE_PREFIX}session_role`);
    localStorage.removeItem(`${STORAGE_PREFIX}session_user`);
    this.emit('auth:change', { role: null, user: null });
  }

  // Active Ride Workflow State
  getActiveRide() {
    return this.get('activeRide', null);
  }

  setActiveRide(ride) {
    this.set('activeRide', ride);
  }

  clearActiveRide() {
    localStorage.removeItem(`${STORAGE_PREFIX}activeRide`);
    this.emit('change:activeRide', null);
  }

  // Audit Log helper
  logAudit(action) {
    const user = this.getCurrentUser();
    const userEmail = (user && user.email) || (user && user.phone) || 'system';
    const logs = this.get('auditLogs', []);
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: userEmail,
      action: action,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1 (Demo)'
    };
    logs.unshift(newLog);
    this.set('auditLogs', logs.slice(0, 50));
  }

  // Reactive Pub/Sub
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).delete(callback);
    }
  }

  emit(event, payload) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => {
        try { cb(payload); } catch (err) { console.error(`Error in event listener ${event}:`, err); }
      });
    }
  }
}

export const store = new CentralStore();
