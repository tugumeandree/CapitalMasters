/**
 * Fix investor data to match CSV
 * Run with: node scripts/fixInvestorData.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function fixData() {
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

    console.log('🔧 FIXING INVESTOR DATA\n');
    console.log('='.repeat(80));

    // Issue 1: Ronald Opakrwoth - Add missing UGX 10,000,000 transaction
    console.log('\n1. Ronald Opakrwoth - Adding missing UGX 10,000,000 investment');
    const ronald = await usersCollection.findOne({ email: 'ronaldopa323@gmail.com' });
    
    if (ronald) {
      const ronaldTransactions = await transactionsCollection.find({ userId: ronald._id.toString() }).toArray();
      console.log(`   Current transactions: ${ronaldTransactions.length}`);
      
      const contributions = ronaldTransactions.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type));
      const totalContribs = contributions.reduce((sum, t) => sum + (t.amount || 0), 0);
      console.log(`   Current total contributions: UGX ${totalContribs.toLocaleString()}`);
      
      if (totalContribs === 0) {
        // Add the missing 10M transaction
        const newTransaction = {
          _id: new ObjectId(),
          userId: ronald._id.toString(),
          type: 'deposit',
          amount: 10000000,
          date: new Date('2025-09-01'), // Set to September 2025 to qualify for Jan 2026 payout
          description: 'Initial investment - Capital contribution',
          status: 'completed',
          createdAt: new Date('2025-09-01'),
          updatedAt: new Date()
        };
        
        await transactionsCollection.insertOne(newTransaction);
        console.log('   ✅ Added UGX 10,000,000 deposit transaction');
        console.log(`   Transaction ID: ${newTransaction._id}`);
      } else {
        console.log('   ℹ️  Ronald already has transactions, skipping');
      }
    } else {
      console.log('   ❌ Ronald Opakrwoth not found');
    }

    // Issue 2: Recheal T Ainembabazi - Remove excess UGX 500,000
    console.log('\n2. Recheal T Ainembabazi - Removing excess UGX 500,000');
    const recheal = await usersCollection.findOne({ email: 'ainerachel50@gmail.com' });
    
    if (recheal) {
      const rechealTransactions = await transactionsCollection.find({ userId: recheal._id.toString() }).toArray();
      console.log(`   Current transactions: ${rechealTransactions.length}`);
      
      const contributions = rechealTransactions.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type));
      const payouts = rechealTransactions.filter(t => ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type));
      const totalContribs = contributions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalPayouts = payouts.reduce((sum, t) => sum + (t.amount || 0), 0);
      const netInvested = totalContribs - totalPayouts;
      
      console.log(`   Current net invested: UGX ${netInvested.toLocaleString()}`);
      console.log(`   Expected: UGX 10,200,000`);
      console.log(`   Difference: UGX ${(netInvested - 10200000).toLocaleString()}`);
      
      if (netInvested === 10700000) {
        // Find and update the most recent deposit to reduce by 500k
        const deposits = contributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (deposits.length > 0) {
          const latestDeposit = deposits[0];
          console.log(`   Found latest deposit: UGX ${latestDeposit.amount.toLocaleString()}`);
          
          if (latestDeposit.amount >= 500000) {
            const newAmount = latestDeposit.amount - 500000;
            await transactionsCollection.updateOne(
              { _id: latestDeposit._id },
              { 
                $set: { 
                  amount: newAmount,
                  updatedAt: new Date(),
                  description: (latestDeposit.description || 'Deposit') + ' (adjusted to match records)'
                } 
              }
            );
            console.log(`   ✅ Reduced transaction from UGX ${latestDeposit.amount.toLocaleString()} to UGX ${newAmount.toLocaleString()}`);
          } else {
            console.log('   ⚠️  Latest deposit too small, adding withdrawal instead');
            // Add a withdrawal transaction
            const withdrawal = {
              _id: new ObjectId(),
              userId: recheal._id.toString(),
              type: 'withdrawal',
              amount: 500000,
              date: new Date(),
              description: 'Adjustment - correction to match records',
              status: 'completed',
              createdAt: new Date(),
              updatedAt: new Date()
            };
            await transactionsCollection.insertOne(withdrawal);
            console.log('   ✅ Added UGX 500,000 withdrawal transaction');
          }
        }
      } else {
        console.log('   ℹ️  Amount already correct or different issue, skipping');
      }
    } else {
      console.log('   ❌ Recheal T Ainembabazi not found');
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ DATA CORRECTION COMPLETE');
    console.log('\nPlease run verifyInvestorData.js again to confirm all data matches CSV');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

fixData();
