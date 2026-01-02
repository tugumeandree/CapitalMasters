const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('capitalmasters');
    const txns = await db.collection('transactions').find({
      userId: new ObjectId('6957b6cdc85467e28d8a7702')
    }).toArray();

    console.log('Total Transactions:', txns.length);
    txns.forEach(t => {
      console.log(`  - ${t.type} | UGX ${(t.amount || 0).toLocaleString()} | ${t.description}`);
    });

    const total = txns.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type)).reduce((s, t) => s + (t.amount || 0), 0);
    console.log('Total Contributions:', total.toLocaleString());
  } finally {
    await client.close();
  }
}

main();
