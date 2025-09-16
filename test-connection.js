const fetch = require('node-fetch');

async function testConnections() {
  console.log('Testing system connectivity...\n');

  // Test Backend Health
  try {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    console.log('✅ Backend Health:', data.status);
  } catch (error) {
    console.log('❌ Backend Health: Failed -', error.message);
  }

  // Test MongoDB Connection
  try {
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://localhost:27017/herbtrace');
    console.log('✅ MongoDB: Connected');
    await mongoose.disconnect();
  } catch (error) {
    console.log('❌ MongoDB: Failed -', error.message);
  }

  // Test Frontend (if running)
  try {
    const response = await fetch('http://localhost:3000');
    if (response.status === 200) {
      console.log('✅ Frontend: Running');
    }
  } catch (error) {
    console.log('❌ Frontend: Not running or failed');
  }

  console.log('\nConnection test complete!');
}

testConnections();