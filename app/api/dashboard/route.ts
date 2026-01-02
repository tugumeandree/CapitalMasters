import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getDatabase, collections } from '@/lib/mongodb';
import { Portfolio, Transaction, Document } from '@/lib/models';
import { ObjectId } from 'mongodb';

async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-characters'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Dashboard API] Fetching data for user:', userId);

    const db = await getDatabase();
    
    // Fetch portfolio
    const portfoliosCollection = db.collection<Portfolio>(collections.portfolios);
    const portfolio = await portfoliosCollection.findOne({ 
      userId: new ObjectId(userId) 
    });

    console.log('[Dashboard API] Portfolio found:', !!portfolio, portfolio ? {
      totalValue: portfolio.totalValue,
      totalGain: portfolio.totalGain,
      holdingsCount: portfolio.holdings?.length
    } : null);

    // Fetch ALL transactions (no limit for accurate calculations)
    const transactionsCollection = db.collection<Transaction>(collections.transactions);
    const transactions = await transactionsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ date: -1 })
      .toArray();

    console.log('[Dashboard API] Transactions found:', transactions.length);

    // Fetch ALL documents (no limit)
    const documentsCollection = db.collection<Document>(collections.documents);
    const documents = await documentsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ uploadedAt: -1 })
      .toArray();

    console.log('[Dashboard API] Documents found:', documents.length);

    const responseData = {
      portfolio: portfolio ? {
        totalValue: portfolio.totalValue,
        totalGain: portfolio.totalGain,
        totalGainPercent: portfolio.totalGainPercent,
        holdings: portfolio.holdings,
      } : null,
      transactions: transactions.map(t => ({
        id: t._id?.toString(),
        type: t.type,
        amount: t.amount,
        description: t.description,
        status: t.status,
        date: t.date.toISOString(),
        investmentType: t.investmentType,
        commodityCompany: t.commodityCompany,
        returnRate: t.returnRate,
        maturityDate: t.maturityDate?.toISOString(),
      })),
      documents: documents.map(d => ({
        id: d._id?.toString(),
        name: d.name,
        type: d.type,
        url: d.url,
        size: d.size,
        date: d.uploadedAt.toISOString(),
      })),
    };

    console.log('[Dashboard API] Sending response:', {
      hasPortfolio: !!responseData.portfolio,
      transactionsCount: responseData.transactions.length,
      documentsCount: responseData.documents.length,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
