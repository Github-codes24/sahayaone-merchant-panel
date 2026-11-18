const http = require('http');
const https = require('https');

async function testApi() {
  const loginPayload = JSON.stringify({
    phoneNumber: "7375564543",
    password: "NewMerchantPassword@123"
  });

  const options = {
    hostname: 'advita-backend.onrender.com',
    port: 443,
    path: '/api/v1/merchant/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginPayload.length
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Login Status:', res.statusCode);
      console.log('Login Response:', data);
      
      const responseData = JSON.parse(data);
      require('fs').writeFileSync('log.json', JSON.stringify(responseData, null, 2));
      const token = responseData?.data?.tokens?.accessToken || responseData?.data?.accessToken;
      console.log('Access Token:', token ? 'Found' : 'Missing');

      const leadsOptions = {
        hostname: 'advita-backend.onrender.com',
        port: 443,
        path: '/api/v1/employee/leads?status=all',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const leadsReq = https.request(leadsOptions, (leadsRes) => {
        let leadsData = '';
        leadsRes.on('data', chunk => leadsData += chunk);
        leadsRes.on('end', () => {
          require('fs').writeFileSync('log.json', JSON.stringify(JSON.parse(leadsData), null, 2));
          console.log('Leads Status:', leadsRes.statusCode);
        });
      });
      leadsReq.end();
    });
  });

  req.write(loginPayload);
  req.end();
}

testApi();
