require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function checkAllDates() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('capitalmasters');
    const users = await db.collection('users').find({ role: 'user' }).toArray();
    const transactions = await db.collection('transactions').find().toArray();
    
    console.log('=== INVESTOR TRANSACTION DATES ===\n');
    
    for (const user of users) {
      const userTxns = transactions
        .filter(t => t.userId?.toString() === user._id?.toString())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (userTxns.length > 0) {
        const oldest = userTxns[0];
        const date = new Date(oldest.date);
        const year = date.getFullYear();
        const isEligible = year === 2025 || year < 2025;
        const isRonald = user.email === 'ronaldopa323@gmail.com';
        const payoutMonth = isRonald ? 'May 2026' : (isEligible ? 'Jan 2026' : 'May 2026');
        
        console.log(`${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  First Transaction: ${date.toISOString().split('T')[0]}`);
        console.log(`  Year: ${year}`);
        console.log(`  Eligible for Jan 2026: ${isEligible}`);
        console.log(`  Expected Payout: ${payoutMonth}`);
        console.log('');
      } else {
        console.log(`${user.name} (${user.email}): No transactions`);
        console.log('');
      }
    }
    
  } finally {
    await client.close();
  }
}

checkAllDates().catch(console.error);
