const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function main() {
  const email = process.argv[2] || 'tkosbert93@gmail.com';
  const amount = 7300000;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('capitalmasters');
    const users = db.collection('users');
    const txns = db.collection('transactions');

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error('User not found:', email);
      return;
    }

    console.log('Resetting transactions for', email, 'id:', user._id.toString());

    // Delete ALL transactions for this user
    const del = await txns.deleteMany({ userId: user._id });
    console.log('Deleted transactions:', del.deletedCount);

    // Insert single clean deposit
    const nowDate = new Date();
    const deposit = {
      userId: user._id,
      type: 'deposit',
      amount,
      description: 'Initial capital contribution',
      status: 'completed',
      date: new Date('2026-01-02'),
      investmentType: 'equity',
      createdAt: nowDate,
      updatedAt: nowDate,
    };

    const ins = await txns.insertOne(deposit);
    console.log('Inserted clean deposit txn id:', ins.insertedId.toString());
    console.log('Total Contributions should now be: UGX', amount.toLocaleString());
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
