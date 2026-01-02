/**
 * Delete transaction with 0 amount
 * Run with: node scripts/deleteZeroTransaction.js
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function deleteZeroTransaction() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db('capitalmasters');

    // Find user
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: 'tkosbert93@gmail.com' });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ Found user:', user.name);

    // Find and delete transactions with 0 amount
    const transactionsCollection = db.collection('transactions');
    const zeroTransactions = await transactionsCollection.find({ 
      userId: user._id,
      amount: 0 
    }).toArray();

    console.log(`\nFound ${zeroTransactions.length} transactions with 0 amount:`);
    zeroTransactions.forEach(t => {
      console.log(`   - ${t.date.toISOString().split('T')[0]} | ${t.type} | ${t.description}`);
    });

    if (zeroTransactions.length > 0) {
      const result = await transactionsCollection.deleteMany({ 
        userId: user._id,
        amount: 0 
      });
      console.log(`\n✅ Deleted ${result.deletedCount} transaction(s) with 0 amount`);
    }

    // Show remaining transactions
    const remaining = await transactionsCollection.find({ userId: user._id }).toArray();
    console.log(`\n📊 Remaining transactions: ${remaining.length}`);
    remaining.forEach(t => {
      console.log(`   - ${t.date.toISOString().split('T')[0]} | ${t.type} | UGX ${t.amount.toLocaleString()} | ${t.description}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

deleteZeroTransaction();
