const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

const investors = [
  {
    name: "Sarah Mbabazi Gunn",
    email: "sarahnyijukire@gmail.com",
    contact: "0773265892",
    contribution: 1000000,
    password: "investor123"
  },
  {
    name: "Ronald Opakrwoth",
    email: "ronaldopa323@gmail.com",
    contact: "0778219524",
    contribution: 10000000,
    password: "investor123"
  }
];

async function addInvestors() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('capitalmasters');
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('transactions');
    const portfoliosCollection = db.collection('portfolios');
    
    for (const investor of investors) {
      console.log(`\n--- Processing ${investor.name} ---`);
      
      // Check if user exists
      let user = await usersCollection.findOne({ email: investor.email });
      
      if (!user) {
        // Hash password
        const hashedPassword = await bcrypt.hash(investor.password, 10);
        
        // Create user
        const userResult = await usersCollection.insertOne({
          name: investor.name,
          email: investor.email,
          contact: investor.contact,
          password: hashedPassword,
          role: 'user',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        user = await usersCollection.findOne({ _id: userResult.insertedId });
        console.log(`✓ Created user: ${investor.name}`);
        console.log(`  Email: ${investor.email}`);
        console.log(`  Password: ${investor.password}`);
      } else {
        console.log(`✓ User already exists: ${investor.name}`);
      }
      
      const userId = user._id;
      
      // Create deposit transaction
      const transactionResult = await transactionsCollection.insertOne({
        userId: userId,
        type: 'deposit',
        amount: investor.contribution,
        investmentType: 'commodities',
        commodity: 'Gold',
        description: `Initial contribution - ${investor.name}`,
        date: new Date(),
        createdAt: new Date()
      });
      
      console.log(`✓ Created deposit transaction: UGX ${investor.contribution.toLocaleString()}`);
      
      // Update or create portfolio
      let portfolio = await portfoliosCollection.findOne({ userId: userId });
      
      if (!portfolio) {
        await portfoliosCollection.insertOne({
          userId: userId,
          totalValue: investor.contribution,
          cash: 0,
          investments: {
            commodities: investor.contribution,
            equity: 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✓ Created portfolio with value: UGX ${investor.contribution.toLocaleString()}`);
      } else {
        const newTotalValue = (portfolio.totalValue || 0) + investor.contribution;
        const newCommodities = (portfolio.investments?.commodities || 0) + investor.contribution;
        
        await portfoliosCollection.updateOne(
          { userId: userId },
          {
            $set: {
              totalValue: newTotalValue,
              'investments.commodities': newCommodities,
              updatedAt: new Date()
            }
          }
        );
        console.log(`✓ Updated portfolio: UGX ${newTotalValue.toLocaleString()}`);
      }
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('All investors have been added successfully!\n');
    console.log('CREDENTIALS:');
    investors.forEach(inv => {
      console.log(`${inv.name}:`);
      console.log(`  Email: ${inv.email}`);
      console.log(`  Password: ${inv.password}`);
      console.log(`  Contribution: UGX ${inv.contribution.toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addInvestors();
