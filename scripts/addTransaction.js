/**
 * Add transaction for a specific user
 * Run with: node scripts/addTransaction.js
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function addTransaction() {
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

    console.log('✅ Found user:', user.name, '-', user.email);
    console.log('   User ID:', user._id.toString());

    // Create transaction
    const transactionsCollection = db.collection('transactions');
    
    const transaction = {
      userId: user._id, // Already an ObjectId
      type: 'deposit',
      amount: 7300000,
      description: 'Initial capital contribution - Coffee & Cocoa commodities investment',
      status: 'completed',
      date: new Date('2025-09-01'),
      createdAt: new Date(),
      investmentType: 'commodities',
      commodityCompany: 'Dregif Coffee Ltd (Coffee & Cocoa)',
      returnRate: 10,
    };

    const result = await transactionsCollection.insertOne(transaction);
    console.log('\n✅ Transaction created successfully!');
    console.log('   Transaction ID:', result.insertedId.toString());
    console.log('   Type:', transaction.type);
    console.log('   Amount: UGX', transaction.amount.toLocaleString());
    console.log('   Date:', transaction.date.toISOString().split('T')[0]);
    console.log('   Investment Type:', transaction.investmentType);
    console.log('   Company:', transaction.commodityCompany);

    // Verify it was saved correctly
    const saved = await transactionsCollection.findOne({ _id: result.insertedId });
    console.log('\n🔍 Verification:');
    console.log('   Saved userId type:', saved.userId.constructor.name);
    console.log('   User _id type:', user._id.constructor.name);
    console.log('   Match:', saved.userId.toString() === user._id.toString() ? '✅ YES' : '❌ NO');

    // Check all transactions for this user
    const allTransactions = await transactionsCollection.find({ userId: user._id }).toArray();
    console.log('\n📊 Total transactions for this user:', allTransactions.length);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

addTransaction();
