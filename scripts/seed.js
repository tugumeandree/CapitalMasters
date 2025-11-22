/**
 * Seed script to populate MongoDB with initial data
 * Run with: node scripts/seed.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('capitalmasters');

    // Create demo user
    const usersCollection = db.collection('users');
    
    // Check if demo user exists
    const existingUser = await usersCollection.findOne({ email: 'demo@capitalmasters.com' });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      
      const demoUser = {
        email: 'demo@capitalmasters.com',
        password: hashedPassword,
        name: 'Demo User',
        accountType: 'individual',
        riskTolerance: 'moderate',
        memberSince: new Date('2020-01-15'),
        phone: '+1 (555) 123-4567',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(demoUser);
      console.log('✅ Demo user created: demo@capitalmasters.com / demo123');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    // Create demo portfolio
    const portfoliosCollection = db.collection('portfolios');
    const user = await usersCollection.findOne({ email: 'demo@capitalmasters.com' });
    
    const existingPortfolio = await portfoliosCollection.findOne({ userId: user._id });
    
    if (!existingPortfolio) {
      const demoPortfolio = {
        userId: user._id,
        totalValue: 2847350,
        totalGain: 347350,
        totalGainPercent: 13.9,
        holdings: [
          { name: 'Equity Portfolio', type: 'Stocks', value: 1250000, allocation: 43.9, change: 5.2 },
          { name: 'Fixed Income', type: 'Bonds', value: 800000, allocation: 28.1, change: 2.1 },
          { name: 'Real Estate Fund', type: 'REIT', value: 500000, allocation: 17.6, change: 8.4 },
          { name: 'Alternative Investments', type: 'Private Equity', value: 297350, allocation: 10.4, change: 12.7 },
        ],
        updatedAt: new Date(),
      };

      await portfoliosCollection.insertOne(demoPortfolio);
      console.log('✅ Demo portfolio created');
    } else {
      console.log('ℹ️  Demo portfolio already exists');
    }

    // Create demo transactions
    const transactionsCollection = db.collection('transactions');
    const existingTransactions = await transactionsCollection.countDocuments({ userId: user._id });
    
    if (existingTransactions === 0) {
      const demoTransactions = [
        {
          userId: user._id,
          type: 'deposit',
          amount: 100000,
          description: 'Initial investment',
          status: 'completed',
          date: new Date('2024-01-15'),
          createdAt: new Date('2024-01-15'),
        },
        {
          userId: user._id,
          type: 'dividend',
          amount: 3250,
          description: 'Q1 2024 Dividend Payment',
          status: 'completed',
          date: new Date('2024-03-31'),
          createdAt: new Date('2024-03-31'),
        },
        {
          userId: user._id,
          type: 'deposit',
          amount: 50000,
          description: 'Additional contribution',
          status: 'completed',
          date: new Date('2024-06-20'),
          createdAt: new Date('2024-06-20'),
        },
        {
          userId: user._id,
          type: 'dividend',
          amount: 3580,
          description: 'Q2 2024 Dividend Payment',
          status: 'completed',
          date: new Date('2024-06-30'),
          createdAt: new Date('2024-06-30'),
        },
      ];

      await transactionsCollection.insertMany(demoTransactions);
      console.log('✅ Demo transactions created');
    } else {
      console.log('ℹ️  Demo transactions already exist');
    }

    // Create demo documents
    const documentsCollection = db.collection('documents');
    const existingDocuments = await documentsCollection.countDocuments({ userId: user._id });
    
    if (existingDocuments === 0) {
      const demoDocuments = [
        {
          userId: user._id,
          name: 'Q3 2024 Portfolio Statement',
          type: 'statement',
          url: '/documents/statement-q3-2024.pdf',
          size: 245760,
          uploadedAt: new Date('2024-10-01'),
        },
        {
          userId: user._id,
          name: '2023 Tax Documents',
          type: 'tax',
          url: '/documents/tax-2023.pdf',
          size: 189440,
          uploadedAt: new Date('2024-01-31'),
        },
        {
          userId: user._id,
          name: 'Annual Performance Report 2023',
          type: 'report',
          url: '/documents/annual-report-2023.pdf',
          size: 524288,
          uploadedAt: new Date('2024-02-15'),
        },
      ];

      await documentsCollection.insertMany(demoDocuments);
      console.log('✅ Demo documents created');
    } else {
      console.log('ℹ️  Demo documents already exist');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nYou can now login with:');
    console.log('  Email: demo@capitalmasters.com');
    console.log('  Password: demo123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
