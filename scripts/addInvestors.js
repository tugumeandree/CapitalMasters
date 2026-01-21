require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in environment or .env.local');
  process.exit(1);
}

const investors = [
  {
    name: 'Osbert Tuhamuhabwa',
    email: 'tkosbert93@gmail.com',
    contact: '0740842914',
    investedAmount: 7300000
  },
  {
    name: 'Shamis Kyozeire',
    email: 'shamiskyozeire5@gmail.com',
    contact: '0700343646',
    investedAmount: 3000000
  },
  {
    name: 'Shiba Tushemerirwe Rweishaka',
    email: 'shebarweishaka@gmail.com',
    contact: '0778280731',
    investedAmount: 1400000
  },
  {
    name: 'Recheal T Ainembabazi',
    email: 'ainerachel50@gmail.com',
    contact: '0758709980',
    investedAmount: 10200000
  },
  {
    name: 'Andrew Tugume',
    email: 'andrewtugume2@gmail.com',
    contact: '0755017384',
    investedAmount: 4000000
  },
  {
    name: 'Okwir Andrew Brian Blaze',
    email: 'blaizepro23@gmail.com',
    contact: '0703901128',
    investedAmount: 4000000
  },
  {
    name: 'Napoleon Mastiko',
    email: 'matsikonapoleon2@gmail.com',
    contact: '0777973507',
    investedAmount: 4000000
  }
];

async function main() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('capitalmasters');
    const users = db.collection('users');
    const transactions = db.collection('transactions');
    const portfolios = db.collection('portfolios');
    
    // Default password for all investors
    const defaultPassword = 'investor123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    let totalInvested = 0;
    
    for (const investor of investors) {
      console.log(`\n--- Processing ${investor.name} ---`);
      
      // Check if user already exists
      const existingUser = await users.findOne({ email: investor.email.toLowerCase() });
      let userId;
      
      if (existingUser) {
        console.log(`User already exists: ${investor.email}`);
        userId = existingUser._id;
        
        // Update contact info
        await users.updateOne(
          { _id: userId },
          { 
            $set: { 
              name: investor.name,
              contact: investor.contact,
              updatedAt: new Date()
            }
          }
        );
        console.log('Updated user contact info');
      } else {
        // Create new user
        const newUser = {
          email: investor.email.toLowerCase(),
          password: hashedPassword,
          name: investor.name,
          contact: investor.contact,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const result = await users.insertOne(newUser);
        userId = result.insertedId;
        console.log(`Created new user: ${investor.email}`);
        console.log(`Default password: ${defaultPassword}`);
      }
      
      // Check existing transactions for this user
      const existingTransactions = await transactions.find({ 
        userId: userId.toString(),
        type: { $in: ['deposit', 'investment', 'loan_given'] }
      }).toArray();
      
      const existingTotal = existingTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      
      console.log(`Existing contributions: UGX ${existingTotal.toLocaleString()}`);
      console.log(`Target amount: UGX ${investor.investedAmount.toLocaleString()}`);
      
      // Add transaction if needed
      if (existingTotal < investor.investedAmount) {
        const difference = investor.investedAmount - existingTotal;
        
        const transaction = {
          userId: userId.toString(),
          type: 'deposit',
          amount: difference,
          description: `Initial investment contribution - ${investor.name}`,
          status: 'completed',
          date: new Date().toISOString().split('T')[0],
          investmentType: 'commodities', // Default to commodities
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await transactions.insertOne(transaction);
        console.log(`Added deposit transaction: UGX ${difference.toLocaleString()}`);
      } else if (existingTotal > investor.investedAmount) {
        console.log(`Warning: Existing total (${existingTotal}) exceeds target (${investor.investedAmount})`);
      } else {
        console.log('Amount already matches. No transaction needed.');
      }
      
      // Create or update portfolio
      const existingPortfolio = await portfolios.findOne({ userId: userId.toString() });
      
      if (!existingPortfolio) {
        const portfolio = {
          userId: userId.toString(),
          totalValue: investor.investedAmount,
          totalGain: 0,
          totalGainPercent: 0,
          holdings: [
            {
              symbol: 'COMMODITIES',
              name: 'Commodities Investment',
              quantity: 1,
              avgPrice: investor.investedAmount,
              currentPrice: investor.investedAmount,
              totalValue: investor.investedAmount,
              gain: 0,
              gainPercent: 0
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await portfolios.insertOne(portfolio);
        console.log('Created portfolio');
      } else {
        console.log('Portfolio already exists');
      }
      
      totalInvested += investor.investedAmount;
    }
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total investors processed: ${investors.length}`);
    console.log(`Total invested amount: UGX ${totalInvested.toLocaleString()}`);
    console.log('\nAll investors have been set up successfully!');
    console.log(`\nDefault password for all new users: ${defaultPassword}`);
    console.log('Please advise users to change their password after first login.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
