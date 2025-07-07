/**
 * Test script for license activation and deactivation flow
 * 
 * This script tests the following:
 * 1. License activation with a valid key
 * 2. Device limit enforcement
 * 3. License status checking
 * 4. Device deactivation
 * 5. Re-activation after deactivation
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  email: 'test@example.com',
  password: 'Test123!',
};

// Test data
const TEST_LICENSE_KEY = 'TEST-LICENSE-KEY-123';
let authToken = '';
let deviceFingerprint = `test-device-${uuidv4()}`;

// Helper functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test suite
async function runTests() {
  console.log('Starting license flow tests...\n');
  
  try {
    // Step 1: Login or create test user
    console.log('1. Authenticating test user...');
    await authenticateUser();
    
    // Step 2: Test license activation
    console.log('\n2. Testing license activation...');
    await testLicenseActivation();
    
    // Step 3: Test device limit
    console.log('\n3. Testing device limit enforcement...');
    await testDeviceLimit();
    
    // Step 4: Test status checking
    console.log('\n4. Testing license status checking...');
    await testStatusChecking();
    
    // Step 5: Test device deactivation
    console.log('\n5. Testing device deactivation...');
    await testDeviceDeactivation();
    
    // Step 6: Test re-activation
    console.log('\n6. Testing reactivation after deactivation...');
    await testReactivation();
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Test implementations
async function authenticateUser() {
  try {
    // In a real test, you would implement actual authentication
    // For this example, we'll simulate a successful login
    console.log('  - Logging in test user...');
    await sleep(500); // Simulate network delay
    
    // In a real implementation, you would:
    // 1. Call your authentication endpoint
    // 2. Get a session token
    // 3. Set the auth token for subsequent requests
    
    // For now, we'll just simulate a successful login
    authToken = 'test-auth-token';
    console.log('  ✅ User authenticated');
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

async function testLicenseActivation() {
  try {
    console.log(`  - Activating license key: ${TEST_LICENSE_KEY}`);
    
    const response = await axios.post(
      `${API_BASE_URL}/license/activate`,
      {
        licenseKey: TEST_LICENSE_KEY,
        deviceFingerprint,
        deviceName: 'Test Device',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
    
    if (response.data.success) {
      console.log('  ✅ License activated successfully');
    } else {
      throw new Error(`Activation failed: ${response.data.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`License activation test failed: ${error.message}`);
  }
}

async function testDeviceLimit() {
  try {
    console.log('  - Testing device limit enforcement...');
    
    // Try to activate with a different device
    const newDeviceFingerprint = `test-device-${uuidv4()}`;
    
    try {
      await axios.post(
        `${API_BASE_URL}/license/activate`,
        {
          licenseKey: TEST_LICENSE_KEY,
          deviceFingerprint: newDeviceFingerprint,
          deviceName: 'Extra Test Device',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      
      // If we get here, the test failed (should have thrown an error)
      throw new Error('Device limit not enforced');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('  ✅ Device limit enforced correctly');
      } else {
        throw new Error(`Unexpected error during device limit test: ${error.message}`);
      }
    }
  } catch (error) {
    throw new Error(`Device limit test failed: ${error.message}`);
  }
}

async function testStatusChecking() {
  try {
    console.log('  - Checking license status...');
    
    const response = await axios.get(
      `${API_BASE_URL}/license/status`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
    
    if (response.data.isValid) {
      console.log('  ✅ License status check successful');
      console.log(`     - Active: ${response.data.isActive}`);
      console.log(`     - Expired: ${response.data.isExpired}`);
      console.log(`     - Devices: ${response.data.devicesUsed}/${response.data.maxDevices}`);
    } else {
      throw new Error('License status check failed: Invalid license');
    }
  } catch (error) {
    throw new Error(`Status check test failed: ${error.message}`);
  }
}

async function testDeviceDeactivation() {
  try {
    console.log('  - Deactivating current device...');
    
    const response = await axios.post(
      `${API_BASE_URL}/license/deactivate`,
      {
        licenseKey: TEST_LICENSE_KEY,
        deviceFingerprint,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
    
    if (response.data.success) {
      console.log('  ✅ Device deactivated successfully');
    } else {
      throw new Error(`Deactivation failed: ${response.data.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Device deactivation test failed: ${error.message}`);
  }
}

async function testReactivation() {
  try {
    console.log('  - Testing reactivation after deactivation...');
    
    // Generate a new device fingerprint to simulate a different device
    const newDeviceFingerprint = `test-device-${uuidv4()}`;
    
    const response = await axios.post(
      `${API_BASE_URL}/license/activate`,
      {
        licenseKey: TEST_LICENSE_KEY,
        deviceFingerprint: newDeviceFingerprint,
        deviceName: 'Reactivated Test Device',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
    
    if (response.data.success) {
      console.log('  ✅ Reactivation successful');
    } else {
      throw new Error(`Reactivation failed: ${response.data.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Reactivation test failed: ${error.message}`);
  }
}

// Run the tests
runTests().catch(console.error);
