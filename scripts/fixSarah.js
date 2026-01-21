require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function fixSarah() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('capitalmasters');
  
  const user = await db.collection('users').findOne({ email: 'sarahnyijukire@gmail.com' });
  console.log('User ID:', user._id.toString());
  
  const txns = await db.collection('transactions').find({ userId: user._id.toString() }).toArray();
  console.log('Transactions found:', txns.length);
  
  if (txns.length > 0) {
    const result = await db.collection('transactions').updateMany(
      { userId: user._id.toString() },
      { $set: { date: new Date('2025-12-15') } }
    );
    console.log('Updated', result.modifiedCount, 'transactions to 2025-12-15');
  }
  
  await client.close();
}

fixSarah().catch(console.error);
