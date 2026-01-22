/**
 * Fix Ronald's duplicate transaction
 * Run with: node scripts/fixRonaldDuplicate.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function fixRonald() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return;
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('capitalmasters');
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('transactions');

    const ronald = await usersCollection.findOne({ email: 'ronaldopa323@gmail.com' });
    
    if (!ronald) {
      console.log('❌ Ronald not found');
      return;
    }

    console.log('👤 Ronald Opakrwoth');
    console.log(`   User ID: ${ronald._id.toString()}\n`);

    const transactions = await transactionsCollection.find({ 
      userId: ronald._id.toString() 
    }).sort({ createdAt: -1 }).toArray();
    
    console.log(`📊 Current Transactions: ${transactions.length}\n`);

    // Find 10M deposit transactions
    const deposits10M = transactions.filter(t => 
      t.type === 'deposit' && t.amount === 10000000
    );

    console.log(`Found ${deposits10M.length} transactions of UGX 10,000,000`);

    if (deposits10M.length > 1) {
      console.log('\n🔧 Removing duplicate 10M transaction(s)...\n');
      
      // Keep the oldest one, remove newer duplicates
      const toKeep = deposits10M[deposits10M.length - 1]; // Oldest (last in desc order)
      const toRemove = deposits10M.slice(0, -1); // All except the oldest
      
      console.log(`✅ Keeping transaction from: ${new Date(toKeep.createdAt).toLocaleString()}`);
      console.log(`   Transaction ID: ${toKeep._id}`);
      console.log(`   Date: ${new Date(toKeep.date).toLocaleDateString()}\n`);
      
      for (const txn of toRemove) {
        console.log(`❌ Removing duplicate from: ${new Date(txn.createdAt).toLocaleString()}`);
        console.log(`   Transaction ID: ${txn._id}`);
        await transactionsCollection.deleteOne({ _id: txn._id });
      }
      
      console.log(`\n✅ Removed ${toRemove.length} duplicate transaction(s)`);
    } else if (deposits10M.length === 1) {
      console.log('\n✅ Only one 10M transaction found - no duplicates to remove');
    } else {
      console.log('\n⚠️  No 10M transactions found');
    }

    // Verify final state
    const finalTransactions = await transactionsCollection.find({ 
      userId: ronald._id.toString() 
    }).toArray();
    
    const contributions = finalTransactions.filter(t => 
      ['deposit', 'investment', 'loan_given'].includes(t.type)
    );
    const payouts = finalTransactions.filter(t => 
      ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
    );
    
    const totalContribs = contributions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalPayouts = payouts.reduce((sum, t) => sum + (t.amount || 0), 0);
    const netInvested = totalContribs - totalPayouts;

    console.log('\n' + '='.repeat(80));
    console.log('\n📈 FINAL VERIFICATION');
    console.log(`   Total Contributions: UGX ${totalContribs.toLocaleString()}`);
    console.log(`   Total Payouts: UGX ${totalPayouts.toLocaleString()}`);
    console.log(`   Net Invested: UGX ${netInvested.toLocaleString()}`);
    console.log(`   Expected: UGX 10,000,000`);
    console.log(`   Match: ${netInvested === 10000000 ? '✅ YES' : '❌ NO'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

fixRonald();
