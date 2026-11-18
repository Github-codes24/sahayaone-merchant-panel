const http = require('http');

async function request(path, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5173,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) {
      body = typeof body === 'string' ? body : JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTest() {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await request('/api/v1/merchant/auth/login', 'POST', {
      phoneNumber: "7375564543",
      password: "NewMerchantPassword@123"
    });
    console.log("Login Res:", loginRes.data?.data?.user?.fullName);
    const token = loginRes.data?.data?.tokens?.accessToken;
    if (!token) throw new Error("No token");

    // 2. Onboard
    const randomPhone = "99" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const randomPan = "TESTP" + Math.floor(Math.random() * 10000).toString().padStart(4, '0') + "A";
    const randomAadhaar = "1111" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    console.log("Onboarding with phone: " + randomPhone + ", PAN: " + randomPan);
    const onboardRes = await request('/api/v1/merchant/leads/onboard', 'POST', {
      phoneNumber: randomPhone,
      panNumber: randomPan,
      aadhaarNumber: randomAadhaar
    }, token);
    
    // We don't get customerId from onboard. Let's create a dummy customer via confirmOnboard first
    const createCustomerRes = await request('/api/v1/merchant/leads/confirm-onboard', 'POST', {
      phoneNumber: randomPhone
    }, token);
    let existingCustomerId = createCustomerRes.data?.data?.id || createCustomerRes.data?.data?.customerId;
    console.log("Created existing customer ID:", existingCustomerId);

    // 3. Verify Aadhaar
    console.log("Verifying Aadhaar...");
    const verifyRes = await request('/api/v1/merchant/leads/verify-aadhaar', 'POST', {
      phoneNumber: randomPhone,
      transactionId: transactionId || "txn_aadhaar_123456",
      otp: "123456"
    }, token);
    console.log("Verify Res:", verifyRes.data);

    if (!customerId) customerId = verifyRes.data?.data?.customerId;
    if (!customerId) customerId = verifyRes.data?.data?.customer?.id;
    console.log("Found Customer ID after Verify:", customerId);

    // 4. Confirm Onboard
    console.log("Confirming onboard...");
    const confirmRes = await request('/api/v1/merchant/leads/confirm-onboard', 'POST', {
      customerId: existingCustomerId,
      fullName: "TEST NAME",
      gender: "MALE",
      dob: "1990-01-01",
      phoneNumber: randomPhone,
      panNumber: randomPan,
      aadhaarNumber: randomAadhaar,
      address: "123 Test St",
      pinCode: "123456"
    }, token);
    console.log("Confirm Res:", confirmRes.data);

    const createdCustomerId = confirmRes.data?.data?.customerId || confirmRes.data?.data?.id;
    console.log("Customer ID from confirmOnboard:", createdCustomerId);

    // 5. Create Draft Lead to check fields
    console.log("Creating Draft Lead...");
    const createRes = await request('/api/v1/merchant/leads/create', 'POST', {
      customerId: createdCustomerId,
      variantId: "65b9d3b2e59df13456789ccc"
    }, token);
    console.log("Create Res:", createRes.data);
    
    const leadId = createRes.data?.data?.leadId;
    if (leadId) {
      console.log("Fetching lead details for leadId:", leadId);
      const leadRes = await request(`/api/v1/merchant/leads/${leadId}`, 'GET', null, token);
      console.log("Final Lead Details Personal Info:", leadRes.data?.data?.personalInformation);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

runTest();
