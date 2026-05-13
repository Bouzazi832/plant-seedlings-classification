import Constants from 'expo-constants';

// Extract the host from the Expo debugger URI.
// When running on a physical device via USB with `adb reverse tcp:5000 tcp:5000`,
// the phone can reach the PC backend at 10.0.2.2:5000 (ADB tunnel) or 127.0.0.1:5000.
// Run: adb reverse tcp:5000 tcp:5000   before starting the app.

const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || '';
let host = debuggerHost.split(':').shift();

if (!host || host === '127.0.0.1' || host === 'localhost') {
  // ADB reverse proxy: phone connects to its own 127.0.0.1 which maps to PC localhost via USB
  host = '127.0.0.1';
}

export const API_BASE_URL = `http://${host}:5000`;

console.log('Detected API_BASE_URL:', API_BASE_URL);
