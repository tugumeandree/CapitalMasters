import { NextResponse } from 'next/server';

// Portfolio data structure representing CapitalMasters' investment portfolio
export interface PortfolioAssetClass {
  id: string;
  name: string;
  allocation: number; // Percentage
  description: string;
  targetReturn: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Investment {
  id: string;
  name: string;
  sector: string;
  description: string;
  amount: number;
  expectedReturn: string;
  duration: string;
  geography: string;
  impact: string[];
  status: 'Active' | 'Matured' | 'Pending';
}

export interface PerformanceData {
  date: string;
  portfolioValue: number;
  benchmark: number;
}

export interface PortfolioData {
  overview: {
    totalAUM: number;
    numberOfInvestments: number;
    averageReturn: string;
    riskProfile: string;
    inceptionDate: string;
  };
  objectives: string[];
  strategy: string;
  assetClasses: PortfolioAssetClass[];
  keyInvestments: Investment[];
  performanceHistory: PerformanceData[];
  geographicExposure: {
    region: string;
    percentage: number;
  }[];
  sectorAllocation: {
    sector: string;
    percentage: number;
  }[];
}

// Mock portfolio data - in production, this would come from MongoDB
const portfolioData: PortfolioData = {
  overview: {
    totalAUM: 900000000, // UGX 900M
    numberOfInvestments: 4,
    averageReturn: '8.6%',
    riskProfile: 'Moderate',
    inceptionDate: '2025-01-01',
  },
  objectives: [
    'Deliver a minimum 8% ROI objective through disciplined portfolio management',
    'Prioritize coffee and cocoa as the current core investment commodities',
    'Preserve member capital using conservative treasury and risk controls',
    'Maintain transparent digital reporting and accountable governance practices',
    'Scale sustainably from SHG stage toward SACCO, MDI, and CMA pathways',
  ],
  strategy:
    "CapitalMasters currently runs a focused investment strategy centered on coffee and cocoa value chains, with a treasury allocation for stability and liquidity. We apply fintech-enabled transaction controls, dual approvals, and periodic reviews to protect principal while pursuing consistent returns. This approach supports our current stage as a disciplined investment club and prepares the business for structured regulatory progression.",
  assetClasses: [
    {
      id: 'coffee',
      name: 'Coffee Investments',
      allocation: 40,
      description:
        'Capital deployment across coffee sourcing, aggregation, and value-chain opportunities with disciplined entry and exit points.',
      targetReturn: '8-12%',
      riskLevel: 'Medium',
    },
    {
      id: 'cocoa',
      name: 'Cocoa Investments',
      allocation: 35,
      description:
        'Targeted cocoa investments focused on supply consistency, quality controls, and structured contract execution.',
      targetReturn: '8-12%',
      riskLevel: 'Medium',
    },
    {
      id: 'treasury-bills',
      name: 'Treasury Bills',
      allocation: 20,
      description:
        'Short-duration treasury allocations to preserve capital and support predictable liquidity management.',
      targetReturn: '7-10%',
      riskLevel: 'Low',
    },
    {
      id: 'cash-reserve',
      name: 'Cash & Operating Reserve',
      allocation: 5,
      description:
        'Operational reserve buffer used for risk control, working liquidity, and controlled deployment timing.',
      targetReturn: '0-4%',
      riskLevel: 'Low',
    },
  ],
  keyInvestments: [
    {
      id: 'inv-001',
      name: 'Uganda Coffee Working Capital Program',
      sector: 'Agribusiness',
      description:
        'Commodity-focused deployment supporting coffee sourcing, aggregation, and contract fulfillment with digital transaction tracking.',
      amount: 260000000,
      expectedReturn: '9%',
      duration: '12 months',
      geography: 'Uganda',
      impact: [
        'Supports member-aligned coffee trade cycles',
        'Digitally tracked transactions and reconciliations',
        'Disciplined exposure with controlled position sizing',
        'Aligned to minimum 8% ROI objective',
      ],
      status: 'Active',
    },
    {
      id: 'inv-002',
      name: 'Cocoa Procurement & Delivery Program',
      sector: 'Agribusiness',
      description:
        'Structured cocoa commodity positions with procurement controls, quality checks, and managed delivery timelines.',
      amount: 220000000,
      expectedReturn: '8.5%',
      duration: '12 months',
      geography: 'Uganda',
      impact: [
        'Improves commodity execution discipline',
        'Strengthens visibility on cash conversion cycle',
        'Supports stable return planning',
        'Uses dual approval transaction controls',
      ],
      status: 'Active',
    },
    {
      id: 'inv-003',
      name: 'Treasury Bill Allocation - 182 Day',
      sector: 'Fixed Income',
      description:
        'Treasury allocation used as a capital-preservation and liquidity anchor for the broader commodity strategy.',
      amount: 180000000,
      expectedReturn: '9.2%',
      duration: '6 months',
      geography: 'Uganda',
      impact: [
        'Stabilizes portfolio downside risk',
        'Supports predictable cash planning',
        'Provides low-volatility return component',
        'Improves short-term liquidity control',
      ],
      status: 'Active',
    },
    {
      id: 'inv-004',
      name: 'Working Capital Reserve Buffer',
      sector: 'Cash Reserve',
      description:
        'Reserved operational liquidity used for controlled deployment timing, transaction settlement, and risk response.',
      amount: 45000000,
      expectedReturn: '3%',
      duration: 'Rolling',
      geography: 'Uganda',
      impact: [
        'Maintains operational resilience',
        'Supports timely settlement execution',
        'Reduces forced liquidation risk',
        'Improves compliance and control continuity',
      ],
      status: 'Active',
    },
  ],
  performanceHistory: [
    { date: '2025-01', portfolioValue: 680000000, benchmark: 675000000 },
    { date: '2025-03', portfolioValue: 715000000, benchmark: 702000000 },
    { date: '2025-05', portfolioValue: 760000000, benchmark: 735000000 },
    { date: '2025-07', portfolioValue: 810000000, benchmark: 770000000 },
    { date: '2025-09', portfolioValue: 860000000, benchmark: 805000000 },
    { date: '2025-11', portfolioValue: 900000000, benchmark: 835000000 },
    { date: '2026-01', portfolioValue: 925000000, benchmark: 855000000 },
  ],
  geographicExposure: [
    { region: 'Uganda', percentage: 62 },
    { region: 'East Africa (ex-Uganda)', percentage: 28 },
    { region: 'Regional Commodity Trade', percentage: 10 },
  ],
  sectorAllocation: [
    { sector: 'Coffee', percentage: 40 },
    { sector: 'Cocoa', percentage: 35 },
    { sector: 'Treasury Bills', percentage: 20 },
    { sector: 'Cash Reserve', percentage: 5 },
  ],
};

export async function GET() {
  try {
    // In production, this would fetch from MongoDB
    // For now, return mock data
    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}
