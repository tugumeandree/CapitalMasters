require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function addRachelTransaction() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('capitalmasters');
    
    // Find Rachel
    const rachel = await db.collection('users').findOne({ email: 'ainerachel50@gmail.com' });
    
    if (!rachel) {
      console.log('❌ Rachel not found');
      return;
    }
    
    console.log('✅ Found Rachel:', rachel.name);
    console.log('   User ID:', rachel._id.toString());
    
    // Check existing transactions
    const existingTxns = await db.collection('transactions').find({ userId: rachel._id.toString() }).toArray();
    console.log('   Existing transactions:', existingTxns.length);
    
    // Create initial investment transaction for Rachel (September 2025)
    const newTransaction = {
      userId: rachel._id.toString(),
      type: 'deposit',
      amount: 500000, // 500K UGX
      description: 'Initial Investment - Coffee Trading',
      date: new Date('2025-09-10'),
      status: 'completed',
      createdAt: new Date('2025-09-10')
    };
    
    const result = await db.collection('transactions').insertOne(newTransaction);
    console.log('✅ Created transaction for Rachel:', result.insertedId);
    console.log('   Amount: 500,000 UGX');
    console.log('   Date: 2025-09-10');
    console.log('   Expected Payout: Jan 2026');
    
    // Update portfolio if exists
    const portfolio = await db.collection('portfolios').findOne({ userId: rachel._id.toString() });
    if (portfolio) {
      await db.collection('portfolios').updateOne(
        { userId: rachel._id.toString() },
        { $set: { totalValue: 500000 } }
      );
      console.log('✅ Updated portfolio value to 500,000 UGX');
    }
    
  } finally {
    await client.close();
  }
}

addRachelTransaction().catch(console.error);
