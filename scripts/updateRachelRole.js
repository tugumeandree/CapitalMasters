require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function updateRachelRole() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('capitalmasters');
  
  await db.collection('users').updateOne(
    { email: 'ainerachel50@gmail.com' },
    { $set: { role: 'user' } }
  );
  
  console.log('✅ Updated Rachel role to "user"');
  
  await client.close();
}

updateRachelRole().catch(console.error);
