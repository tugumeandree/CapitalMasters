/**
 * Check Ronald's transactions
 * Run with: node scripts/checkRonaldTransactions.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkRonald() {
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
    console.log(`   User ID: ${ronald._id.toString()}`);
    console.log(`   Email: ${ronald.email}`);
    console.log(`   Contact: ${ronald.contact}\n`);

    const transactions = await transactionsCollection.find({ userId: ronald._id.toString() }).sort({ date: 1 }).toArray();
    
    console.log(`📊 Total Transactions: ${transactions.length}\n`);
    console.log('=' .repeat(100));

    let runningTotal = 0;
    transactions.forEach((txn, index) => {
      const amount = txn.amount || 0;
      const isCredit = ['deposit', 'investment', 'loan_given'].includes(txn.type);
      runningTotal += isCredit ? amount : -amount;

      console.log(`\n${index + 1}. ${txn.type.toUpperCase()}`);
      console.log(`   Transaction ID: ${txn._id}`);
      console.log(`   Amount: UGX ${amount.toLocaleString()} ${isCredit ? '(+)' : '(-)'}`);
      console.log(`   Date: ${new Date(txn.date).toLocaleDateString()}`);
      console.log(`   Description: ${txn.description || 'N/A'}`);
      console.log(`   Status: ${txn.status}`);
      console.log(`   Created: ${new Date(txn.createdAt).toLocaleString()}`);
      console.log(`   Running Balance: UGX ${runningTotal.toLocaleString()}`);
    });

    console.log('\n' + '=' .repeat(100));
    
    const contributions = transactions.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type));
    const payouts = transactions.filter(t => ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type));
    
    const totalContribs = contributions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalPayouts = payouts.reduce((sum, t) => sum + (t.amount || 0), 0);
    const netInvested = totalContribs - totalPayouts;

    console.log('\n📈 SUMMARY');
    console.log(`   Total Contributions: UGX ${totalContribs.toLocaleString()}`);
    console.log(`   Total Payouts: UGX ${totalPayouts.toLocaleString()}`);
    console.log(`   Net Invested (Principal): UGX ${netInvested.toLocaleString()}`);
    console.log(`   Expected Payout (32%): UGX ${(netInvested * 0.32).toLocaleString()}\n`);
    
    console.log('❗ EXPECTED FROM CSV: UGX 10,000,000');
    console.log(`❗ DIFFERENCE: UGX ${(netInvested - 10000000).toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

checkRonald();
