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

    // Support both ObjectId and string-stored userId
    const userIdObj = new ObjectId(userId);
    const userMatch: any = { $or: [{ userId: userIdObj }, { userId: userId }] };
    
    // Fetch portfolio
    const portfoliosCollection = db.collection<Portfolio>(collections.portfolios);
    const portfolio = await portfoliosCollection.findOne(userMatch);

    console.log('[Dashboard API] Portfolio found:', !!portfolio, portfolio ? {
      totalValue: portfolio.totalValue,
      totalGain: portfolio.totalGain,
      holdingsCount: portfolio.holdings?.length
    } : null);

    // Fetch ALL transactions (no limit for accurate calculations)
    const transactionsCollection = db.collection<Transaction>(collections.transactions);
    const transactions = await transactionsCollection
      .find(userMatch)
      .sort({ date: -1 })
      .toArray();

    console.log('[Dashboard API] Transactions found:', transactions.length);

    // Fetch ALL documents (no limit)
    const documentsCollection = db.collection<Document>(collections.documents);
    const documents = await documentsCollection
      .find(userMatch)
      .sort({ uploadedAt: -1 })
      .toArray();

    console.log('[Dashboard API] Documents found:', documents.length);

    const responseData = {
      portfolio: portfolio ? {
        totalValue: portfolio.totalValue,
        totalGain: portfolio.totalGain,
        totalGainPercent: portfolio.totalGainPercent,
        holdings: portfolio.holdings || [],
      } : null,
      transactions: transactions.map(t => {
        try {
          let dateStr: string;
          if (!t.date) {
            dateStr = new Date().toISOString();
          } else if (t.date instanceof Date) {
            dateStr = t.date.toISOString();
          } else if (typeof t.date === 'string') {
            dateStr = new Date(t.date).toISOString();
          } else {
            dateStr = new Date().toISOString();
          }

          let maturityDateStr: string | undefined;
          if (t.maturityDate) {
            if (t.maturityDate instanceof Date) {
              maturityDateStr = t.maturityDate.toISOString();
            } else if (typeof t.maturityDate === 'string') {
              maturityDateStr = new Date(t.maturityDate).toISOString();
            }
          }

          return {
            id: t._id?.toString(),
            type: t.type,
            amount: t.amount,
            description: t.description,
            status: t.status,
            date: dateStr,
            investmentType: t.investmentType,
            commodityCompany: t.commodityCompany,
            returnRate: t.returnRate,
            maturityDate: maturityDateStr,
          };
        } catch (err) {
          console.error('Error processing transaction:', t, err);
          return {
            id: t._id?.toString(),
            type: t.type,
            amount: t.amount,
            description: t.description,
            status: t.status,
            date: new Date().toISOString(),
            investmentType: t.investmentType,
            commodityCompany: t.commodityCompany,
            returnRate: t.returnRate,
            maturityDate: undefined,
          };
        }
      }),
      documents: documents.map(d => {
        try {
          let dateStr: string;
          if (!d.uploadedAt) {
            dateStr = new Date().toISOString();
          } else if (d.uploadedAt instanceof Date) {
            dateStr = d.uploadedAt.toISOString();
          } else if (typeof d.uploadedAt === 'string') {
            dateStr = new Date(d.uploadedAt).toISOString();
          } else {
            dateStr = new Date().toISOString();
          }

          return {
            id: d._id?.toString(),
            name: d.name,
            type: d.type,
            url: d.url,
            size: d.size,
            date: dateStr,
          };
        } catch (err) {
          console.error('Error processing document:', d, err);
          return {
            id: d._id?.toString(),
            name: d.name,
            type: d.type,
            url: d.url,
            size: d.size,
            date: new Date().toISOString(),
          };
        }
      }),
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
