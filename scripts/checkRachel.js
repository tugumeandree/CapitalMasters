require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkRachel() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('capitalmasters');
    
    const rachel = await db.collection('users').findOne({ email: 'ainerachel50@gmail.com' });
    console.log('Rachel user:', JSON.stringify(rachel, null, 2));
    
    const txns = await db.collection('transactions').find({ userId: rachel._id.toString() }).toArray();
    console.log('\nRachel transactions:', txns.length);
    txns.forEach(t => {
      console.log(`  - ${t.date} | ${t.type} | ${t.amount}`);
    });
    
  } finally {
    await client.close();
  }
}

checkRachel().catch(console.error);
