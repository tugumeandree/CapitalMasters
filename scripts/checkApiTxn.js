const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/transactions',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN || 'test'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const txns = JSON.parse(data);
      const tkTxns = txns.filter(t => t.userId === '6957b6cdc85467e28d8a7702' || t.userId?.includes('6957b6cdc85467e28d8a7702'));
      console.log('TK user transactions from API:');
      tkTxns.forEach(t => console.log(`  - ${t.type} | UGX ${t.amount?.toLocaleString()} | ${t.description}`));
      console.log('Total:', tkTxns.length);
    } catch(e) {
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', console.error);
req.end();
