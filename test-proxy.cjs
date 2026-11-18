const http = require('http');

async function testProxy() {
  const loginPayload = JSON.stringify({
    phoneNumber: "7375564543",
    password: "NewMerchantPassword@123"
  });

  const options = {
    hostname: 'localhost',
    port: 5174,
    path: '/api/v1/merchant/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginPayload.length
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Proxy Login Status:', res.statusCode);
      console.log('Proxy Login Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Problem with request:', e.message);
  });

  req.write(loginPayload);
  req.end();
}

testProxy();
