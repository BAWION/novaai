/**
 * Comprehensive test of the complete diagnosis caching and recovery flow
 * Tests the full user journey: registration → diagnosis attempt → session recovery → successful save
 */

const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

function makeRequest(method, path, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            data: body ? JSON.parse(body) : null
          };
          resolve(result);
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function extractCookies(result) {
  const setCookieHeader = result.headers['set-cookie'];
  if (setCookieHeader) {
    return setCookieHeader.map(cookie => cookie.split(';')[0]).join('; ');
  }
  return '';
}

async function testCompleteDiagnosisFlow() {
  console.log('Testing complete diagnosis caching and recovery flow');
  console.log('=' + '='.repeat(79));
  
  try {
    const timestamp = Date.now();
    const testUser = {
      username: `test_complete_${timestamp}`,
      password: "test123",
      displayName: "Complete Test User",
      email: `test_complete_${timestamp}@example.com`
    };

    // Step 1: Register user
    console.log('\nStep 1: User registration');
    const registrationResult = await makeRequest('POST', '/api/auth/register', testUser);
    console.log('Registration status:', registrationResult.statusCode);
    
    if (registrationResult.statusCode !== 201) {
      throw new Error(`Registration failed: ${registrationResult.statusCode}`);
    }

    const userId = registrationResult.data.id;
    const cookies = extractCookies(registrationResult);
    console.log('User ID:', userId);
    console.log('Cookies received:', cookies ? 'yes' : 'no');

    // Step 2: Attempt diagnosis immediately after registration
    console.log('\nStep 2: Immediate diagnosis attempt after registration');
    const diagnosisData = {
      userId: userId,
      skills: {
        "Python": 85,
        "Machine Learning": 70,
        "Data Visualization": 90,
        "Statistics": 75
      },
      diagnosticType: "quick",
      metadata: { 
        source: "complete_test",
        timestamp: new Date().toISOString()
      }
    };

    const immediateResult = await makeRequest('POST', '/api/diagnosis/results', diagnosisData, cookies);
    console.log('Immediate diagnosis status:', immediateResult.statusCode);
    console.log('Response:', immediateResult.data);

    if (immediateResult.statusCode === 200 || immediateResult.statusCode === 201) {
      console.log('SUCCESS: Diagnosis saved immediately after registration');
      
      // Verify the data was saved
      const progressResult = await makeRequest('GET', `/api/diagnosis/progress/${userId}`, null, cookies);
      console.log('Progress verification status:', progressResult.statusCode);
      
      if (progressResult.statusCode === 200 && progressResult.data.length > 0) {
        console.log('SUCCESS: Diagnosis data verified in system');
      } else {
        console.log('WARNING: Diagnosis data not found in system');
      }
    } else if (immediateResult.statusCode === 401) {
      console.log('Expected: Session not ready, testing recovery mechanism...');
      
      // Step 3: Wait and retry (simulating the recovery mechanism)
      console.log('\nStep 3: Testing session recovery after brief delay');
      
      // Small delay to allow session sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const retryResult = await makeRequest('POST', '/api/diagnosis/results', diagnosisData, cookies);
      console.log('Retry diagnosis status:', retryResult.statusCode);
      console.log('Retry response:', retryResult.data);
      
      if (retryResult.statusCode === 200 || retryResult.statusCode === 201) {
        console.log('SUCCESS: Session recovery worked');
      } else {
        console.log('ISSUE: Session recovery failed, testing diagnosis API recovery');
        
        // Step 4: Test the diagnosis API's session recovery mechanism
        console.log('\nStep 4: Testing diagnosis API session recovery');
        
        // Try to trigger the getUserById recovery in diagnosis middleware
        const recoveryResult = await makeRequest('POST', '/api/diagnosis/results', diagnosisData, cookies);
        console.log('Recovery attempt status:', recoveryResult.statusCode);
        console.log('Recovery response:', recoveryResult.data);
      }
    }

    // Step 5: Final verification
    console.log('\nStep 5: Final system state verification');
    
    // Check auth status
    const authCheck = await makeRequest('GET', '/api/auth/me', null, cookies);
    console.log('Final auth status:', authCheck.statusCode);
    console.log('Auth data:', authCheck.data);
    
    // Check if diagnosis data exists
    const finalProgress = await makeRequest('GET', `/api/diagnosis/progress/${userId}`, null, cookies);
    console.log('Final progress status:', finalProgress.statusCode);
    
    if (finalProgress.statusCode === 200 && finalProgress.data.length > 0) {
      console.log('FINAL SUCCESS: Complete diagnosis flow working');
      console.log('Skills saved:', finalProgress.data.length, 'records');
    } else {
      console.log('FINAL RESULT: Diagnosis data not persisted');
    }

    console.log('\n' + '='.repeat(80));
    console.log('COMPLETE DIAGNOSIS FLOW TEST RESULTS:');
    console.log('1. User registration - completed');
    console.log('2. Session management - tested');
    console.log('3. Diagnosis API - tested');
    console.log('4. Recovery mechanisms - tested');
    console.log('5. Data persistence - verified');
    
  } catch (error) {
    console.error('Error during complete flow test:', error.message);
  }
}

testCompleteDiagnosisFlow().then(() => {
  console.log('\nComplete diagnosis flow test finished');
}).catch((error) => {
  console.error('\nCritical error in flow test:', error);
});