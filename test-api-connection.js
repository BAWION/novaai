// Тест подключения к API для диагностики проблемы авторизации
const API_BASE = 'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev';

async function testApiConnection() {
  console.log('Testing API connection...');
  
  try {
    // Тест основного эндпоинта
    const healthResponse = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Health check status:', healthResponse.status);
    console.log('Headers:', [...healthResponse.headers.entries()]);
    
    if (healthResponse.status === 401) {
      console.log('✓ API works - 401 expected for unauthenticated request');
    }
    
    // Тест регистрации
    const testUser = {
      username: 'test_user_' + Date.now(),
      email: 'test@example.com',
      password: 'testpassword123'
    };
    
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    console.log('Register test status:', registerResponse.status);
    const registerData = await registerResponse.text();
    console.log('Register response:', registerData);
    
  } catch (error) {
    console.error('API connection error:', error);
  }
}

testApiConnection();