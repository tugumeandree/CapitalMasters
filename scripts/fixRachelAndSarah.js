require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function fixRachelAndSarah() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('capitalmasters');
    
    // Fix Rachel's transaction date to September 2025
    const rachel = await db.collection('users').findOne({ email: 'ainerachel50@gmail.com' });
    if (rachel) {
      const rachelResult = await db.collection('transactions').updateMany(
        { userId: rachel._id.toString() },
        { $set: { date: new Date('2025-09-10') } }
      );
      console.log(`✅ Rachel: Updated ${rachelResult.modifiedCount} transaction(s) to 2025-09-10`);
    } else {
      console.log('❌ Rachel not found');
    }
    
    // Fix Sarah's transaction date to December 2025
    const sarah = await db.collection('users').findOne({ email: 'sarahnyijukire@gmail.com' });
    if (sarah) {
      // Check if she has transactions
      const sarahTxns = await db.collection('transactions').find({ userId: sarah._id.toString() }).toArray();
      console.log(`Sarah has ${sarahTxns.length} transactions`);
      
      if (sarahTxns.length > 0) {
        const sarahResult = await db.collection('transactions').updateMany(
          { userId: sarah._id.toString() },
          { $set: { date: new Date('2025-12-15') } }
        );
        console.log(`✅ Sarah: Updated ${sarahResult.modifiedCount} transaction(s) to 2025-12-15`);
      } else {
        // Create a transaction for Sarah if she doesn't have any
        const portfolio = await db.collection('portfolios').findOne({ userId: sarah._id.toString() });
        
        // Get her contribution amount from when we added her
        // She was added with 1M UGX
        const newTransaction = {
          userId: sarah._id.toString(),
          type: 'deposit',
          amount: 1000000,
          description: 'Initial Investment - Coffee Trading',
          date: new Date('2025-12-15'),
          status: 'completed',
          createdAt: new Date('2025-12-15')
        };
        
        await db.collection('transactions').insertOne(newTransaction);
        console.log(`✅ Sarah: Created new transaction for 2025-12-15 (1,000,000 UGX)`);
      }
    } else {
      console.log('❌ Sarah not found');
    }
    
    console.log('\n✅ Done! Now checking all dates...\n');
    
    // Verify the changes
    const users = await db.collection('users').find({ role: 'user' }).toArray();
    const transactions = await db.collection('transactions').find().toArray();
    
    for (const user of users) {
      const userTxns = transactions
        .filter(t => t.userId?.toString() === user._id?.toString())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (userTxns.length > 0) {
        const oldest = userTxns[0];
        const date = new Date(oldest.date);
        const year = date.getFullYear();
        const isRonald = user.email === 'ronaldopa323@gmail.com';
        const payoutMonth = isRonald ? 'May 2026' : (year === 2025 ? 'Jan 2026' : 'May 2026');
        
        console.log(`${user.name} (${user.email}): ${date.toISOString().split('T')[0]} → ${payoutMonth}`);
      }
    }
    
  } finally {
    await client.close();
  }
}

fixRachelAndSarah().catch(console.error);
