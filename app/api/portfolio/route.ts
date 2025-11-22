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
    totalAUM: 2500000000, // $2.5B
    numberOfInvestments: 47,
    averageReturn: '12.8%',
    riskProfile: 'Moderate',
    inceptionDate: '2008-03-15',
  },
  objectives: [
    'Achieve consistent long-term capital appreciation across African markets',
    'Provide diversified exposure to high-growth sectors driving continental transformation',
    'Generate stable income through dividend-yielding and fixed-income investments',
    'Support sustainable development and positive social impact across Africa',
    'Maintain disciplined risk management while maximizing risk-adjusted returns',
  ],
  strategy:
    "CapitalMasters employs a diversified, research-driven investment approach focused on Africa's most promising growth sectors. We combine fundamental analysis with deep local market expertise to identify undervalued opportunities in equities, real estate, agribusiness, and infrastructure. Our strategy emphasizes long-term value creation, strategic partnerships with African enterprises, and responsible investment practices that align financial returns with sustainable development goals.",
  assetClasses: [
    {
      id: 'equities',
      name: 'African Equities',
      allocation: 35,
      description:
        'Diversified holdings in listed and pre-IPO African companies across key growth sectors including financial services, telecommunications, consumer goods, and technology.',
      targetReturn: '14-18%',
      riskLevel: 'Medium',
    },
    {
      id: 'real-estate',
      name: 'Real Estate & Infrastructure',
      allocation: 25,
      description:
        'Commercial real estate, residential developments, and infrastructure projects in major African cities. Focus on Grade A office spaces, mixed-use developments, and logistics facilities.',
      targetReturn: '10-14%',
      riskLevel: 'Medium',
    },
    {
      id: 'agribusiness',
      name: 'Agribusiness',
      allocation: 20,
      description:
        'Strategic investments in African agriculture value chains including coffee, cocoa, tea plantations, processing facilities, and agricultural technology platforms.',
      targetReturn: '12-16%',
      riskLevel: 'Medium',
    },
    {
      id: 'fixed-income',
      name: 'Fixed Income',
      allocation: 15,
      description:
        'Government and corporate bonds, treasury bills, and structured debt instruments from stable African economies providing steady income and capital preservation.',
      targetReturn: '7-10%',
      riskLevel: 'Low',
    },
    {
      id: 'private-equity',
      name: 'Private Equity',
      allocation: 5,
      description:
        'Direct investments in high-potential African startups and SMEs, focusing on fintech, healthtech, edtech, and sustainable energy solutions.',
      targetReturn: '18-25%',
      riskLevel: 'High',
    },
  ],
  keyInvestments: [
    {
      id: 'inv-001',
      name: 'East African Coffee Cooperative',
      sector: 'Agribusiness',
      description:
        'Partnership with 5,000+ smallholder coffee farmers in Uganda, Rwanda, and Kenya. Includes processing facilities, direct trade channels, and organic certification programs.',
      amount: 45000000,
      expectedReturn: '14%',
      duration: '7 years',
      geography: 'East Africa',
      impact: [
        '5,000+ farmers supported',
        '30% income increase for farmers',
        'Sustainable farming practices',
        'Export to 15 countries',
      ],
      status: 'Active',
    },
    {
      id: 'inv-002',
      name: 'Kampala City Centre Development',
      sector: 'Real Estate',
      description:
        'Mixed-use development in Kampala CBD featuring Grade A office space, retail units, and luxury apartments. Strategic location near government ministries and corporate headquarters.',
      amount: 85000000,
      expectedReturn: '12%',
      duration: '10 years',
      geography: 'Uganda',
      impact: [
        '2,000 jobs created',
        'LEED-certified green building',
        'Modern commercial infrastructure',
        'Urban development catalyst',
      ],
      status: 'Active',
    },
    {
      id: 'inv-003',
      name: 'Pan-African Fintech Growth Fund',
      sector: 'Technology',
      description:
        'Portfolio of 12 African fintech companies providing mobile banking, payment solutions, and digital lending across 8 African countries.',
      amount: 60000000,
      expectedReturn: '22%',
      duration: '5 years',
      geography: 'Pan-African',
      impact: [
        '8M+ users served',
        'Financial inclusion expansion',
        '40% serving unbanked populations',
        'Digital economy enablement',
      ],
      status: 'Active',
    },
    {
      id: 'inv-004',
      name: 'West African Cocoa Processing',
      sector: 'Agribusiness',
      description:
        'Cocoa processing facilities in Ghana and Côte d\'Ivoire, adding value to raw cocoa exports through local processing and chocolate production.',
      amount: 52000000,
      expectedReturn: '15%',
      duration: '8 years',
      geography: 'West Africa',
      impact: [
        '3,000+ farmers in supply chain',
        'Local value addition',
        'Export quality standards',
        '500 processing jobs created',
      ],
      status: 'Active',
    },
    {
      id: 'inv-005',
      name: 'African Renewable Energy Portfolio',
      sector: 'Infrastructure',
      description:
        'Solar and wind energy projects across Kenya, Tanzania, and South Africa providing clean energy to 200,000+ households and businesses.',
      amount: 120000000,
      expectedReturn: '11%',
      duration: '15 years',
      geography: 'East & Southern Africa',
      impact: [
        '200,000+ households powered',
        '150 MW capacity',
        'Carbon emissions reduction',
        'Energy access expansion',
      ],
      status: 'Active',
    },
    {
      id: 'inv-006',
      name: 'Lagos Industrial Logistics Hub',
      sector: 'Real Estate',
      description:
        'Modern warehouse and logistics facility serving West African trade corridor. Includes cold storage, distribution center, and transport fleet.',
      amount: 75000000,
      expectedReturn: '13%',
      duration: '12 years',
      geography: 'Nigeria',
      impact: [
        'Regional trade facilitation',
        '800 direct jobs',
        'Supply chain efficiency',
        'E-commerce enablement',
      ],
      status: 'Active',
    },
  ],
  performanceHistory: [
    { date: '2020-01', portfolioValue: 1850000000, benchmark: 1820000000 },
    { date: '2020-04', portfolioValue: 1780000000, benchmark: 1750000000 },
    { date: '2020-07', portfolioValue: 1920000000, benchmark: 1880000000 },
    { date: '2020-10', portfolioValue: 2050000000, benchmark: 2000000000 },
    { date: '2021-01', portfolioValue: 2150000000, benchmark: 2080000000 },
    { date: '2021-04', portfolioValue: 2220000000, benchmark: 2140000000 },
    { date: '2021-07', portfolioValue: 2300000000, benchmark: 2210000000 },
    { date: '2021-10', portfolioValue: 2380000000, benchmark: 2280000000 },
    { date: '2022-01', portfolioValue: 2280000000, benchmark: 2200000000 },
    { date: '2022-04', portfolioValue: 2320000000, benchmark: 2240000000 },
    { date: '2022-07', portfolioValue: 2400000000, benchmark: 2310000000 },
    { date: '2022-10', portfolioValue: 2450000000, benchmark: 2360000000 },
    { date: '2023-01', portfolioValue: 2480000000, benchmark: 2390000000 },
    { date: '2023-04', portfolioValue: 2520000000, benchmark: 2420000000 },
    { date: '2023-07', portfolioValue: 2580000000, benchmark: 2480000000 },
    { date: '2023-10', portfolioValue: 2620000000, benchmark: 2510000000 },
    { date: '2024-01', portfolioValue: 2650000000, benchmark: 2540000000 },
    { date: '2024-04', portfolioValue: 2680000000, benchmark: 2570000000 },
    { date: '2024-07', portfolioValue: 2720000000, benchmark: 2600000000 },
    { date: '2024-10', portfolioValue: 2750000000, benchmark: 2630000000 },
    { date: '2025-01', portfolioValue: 2780000000, benchmark: 2660000000 },
    { date: '2025-04', portfolioValue: 2820000000, benchmark: 2690000000 },
    { date: '2025-07', portfolioValue: 2860000000, benchmark: 2720000000 },
    { date: '2025-10', portfolioValue: 2900000000, benchmark: 2750000000 },
  ],
  geographicExposure: [
    { region: 'East Africa', percentage: 42 },
    { region: 'West Africa', percentage: 28 },
    { region: 'Southern Africa', percentage: 18 },
    { region: 'North Africa', percentage: 8 },
    { region: 'Central Africa', percentage: 4 },
  ],
  sectorAllocation: [
    { sector: 'Financial Services', percentage: 22 },
    { sector: 'Real Estate', percentage: 25 },
    { sector: 'Agribusiness', percentage: 20 },
    { sector: 'Technology', percentage: 12 },
    { sector: 'Infrastructure', percentage: 11 },
    { sector: 'Consumer Goods', percentage: 6 },
    { sector: 'Healthcare', percentage: 4 },
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
