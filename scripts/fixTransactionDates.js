require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function fixTransactionDates() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('capitalmasters');
    
    // Investors who should have started in September 2025 (eligible for Jan 2026 payout)
    // Ronald should stay as Jan 2026 investment
    const investorsToFix = [
      { email: 'tkosbert93@gmail.com', startDate: '2025-09-15' },
      { email: 'shamiskyozeire5@gmail.com', startDate: '2025-09-20' },
      { email: 'shebarweishaka@gmail.com', startDate: '2025-09-25' },
      { email: 'andrewtugume2@gmail.com', startDate: '2025-10-05' },
      { email: 'blaizepro23@gmail.com', startDate: '2025-10-10' },
      { email: 'matsikonapoleon2@gmail.com', startDate: '2025-11-01' },
      { email: 'sarahnyijukire@gmail.com', startDate: '2025-12-15' }
      // ronaldopa323@gmail.com stays as 2026-01-21 (current)
    ];
    
    console.log('=== UPDATING TRANSACTION DATES ===\n');
    
    for (const investor of investorsToFix) {
      const user = await db.collection('users').findOne({ email: investor.email });
      
      if (user) {
        const newDate = new Date(investor.startDate);
        
        // Update all transactions for this user
        const result = await db.collection('transactions').updateMany(
          { userId: user._id.toString() },
          { $set: { date: newDate } }
        );
        
        console.log(`✅ ${user.name} (${investor.email})`);
        console.log(`   Updated ${result.modifiedCount} transaction(s) to ${investor.startDate}\n`);
      } else {
        console.log(`❌ User not found: ${investor.email}\n`);
      }
    }
    
    console.log('✅ All transaction dates updated successfully!');
    console.log('\nNow investors will show:');
    console.log('- Jan 2026 payout: All except Ronald');
    console.log('- May 2026 payout: Ronald only');
    
  } finally {
    await client.close();
  }
}

fixTransactionDates().catch(console.error);
