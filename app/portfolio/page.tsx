'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChartBarIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import SectorAllocationChart from '@/components/charts/SectorAllocationChart';
import GeographicExposureChart from '@/components/charts/GeographicExposureChart';
import PortfolioPerformanceChart from '@/components/charts/PortfolioPerformanceChart';

interface PortfolioData {
  overview: {
    totalAUM: number;
    numberOfInvestments: number;
    averageReturn: string;
    riskProfile: string;
    inceptionDate: string;
  };
  objectives: string[];
  strategy: string;
  assetClasses: Array<{
    id: string;
    name: string;
    allocation: number;
    description: string;
    targetReturn: string;
    riskLevel: string;
  }>;
  keyInvestments: Array<{
    id: string;
    name: string;
    sector: string;
    description: string;
    amount: number;
    expectedReturn: string;
    duration: string;
    geography: string;
    impact: string[];
    status: string;
  }>;
  performanceHistory: Array<{
    date: string;
    portfolioValue: number;
    benchmark: number;
  }>;
  geographicExposure: Array<{
    region: string;
    percentage: number;
  }>;
  sectorAllocation: Array<{
    sector: string;
    percentage: number;
  }>;
}

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) throw new Error('Failed to fetch portfolio data');
        const data = await response.json();
        setPortfolioData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load portfolio'}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, objectives, strategy, assetClasses, keyInvestments, performanceHistory, geographicExposure, sectorAllocation } = portfolioData;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white section-padding">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Investment Portfolio</h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 mb-8">
              Discover how CapitalMasters is channeling global capital into Africa's most promising 
              investment opportunities, driving sustainable growth and transforming economies across the continent.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <p className="text-primary-200 text-xs sm:text-sm mb-1">Assets Under Management</p>
                <p className="text-2xl sm:text-3xl font-bold">${(overview.totalAUM / 1000000000).toFixed(1)}B</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-primary-200 text-sm mb-1">Active Investments</p>
                <p className="text-3xl font-bold">{overview.numberOfInvestments}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-primary-200 text-sm mb-1">Average Return</p>
                <p className="text-3xl font-bold">{overview.averageReturn}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-primary-200 text-sm mb-1">Risk Profile</p>
                <p className="text-3xl font-bold">{overview.riskProfile}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Objectives */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">Portfolio Objectives</h2>
            <div className="space-y-4">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-lg text-gray-700 pt-1">{objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Strategy */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <ChartBarIcon className="h-10 w-10 text-primary-600 mr-4" />
              <h2 className="text-4xl font-bold text-gray-900">Investment Strategy</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{strategy}</p>
          </div>
        </div>
      </section>

      {/* Asset Classes */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">Asset Classes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {assetClasses.map((assetClass) => (
              <div key={assetClass.id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{assetClass.name}</h3>
                  <span className="text-3xl font-bold text-primary-600">{assetClass.allocation}%</span>
                </div>
                <p className="text-gray-700 mb-4">{assetClass.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Target Return</p>
                    <p className="font-semibold text-green-600">{assetClass.targetReturn}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Risk Level</p>
                    <p className="font-semibold text-gray-900">{assetClass.riskLevel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Performance */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">Portfolio Performance</h2>
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md">
            <p className="text-gray-600 mb-6 text-center">
              Historical performance vs. benchmark index (2020-2025)
            </p>
            <PortfolioPerformanceChart data={performanceHistory} />
          </div>
        </div>
      </section>

      {/* Allocation Charts */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">Portfolio Allocation</h2>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sector Allocation</h3>
              <SectorAllocationChart data={sectorAllocation} />
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Geographic Exposure</h3>
              <GeographicExposureChart data={geographicExposure} />
            </div>
          </div>
        </div>
      </section>

      {/* Key Investments */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Featured Investments</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-12 text-center max-w-3xl mx-auto">
            Strategic investments driving Africa's economic transformation and delivering sustainable returns
          </p>
          <div className="grid gap-6 md:gap-8">
            {keyInvestments.map((investment) => (
              <div key={investment.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{investment.name}</h3>
                    <span className="bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {investment.status}
                    </span>
                  </div>
                  <p className="text-primary-100">{investment.sector}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{investment.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Investment Amount</p>
                      <p className="font-bold text-gray-900">${(investment.amount / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected Return</p>
                      <p className="font-bold text-green-600">{investment.expectedReturn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-bold text-gray-900">{investment.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Geography</p>
                      <p className="font-bold text-gray-900">{investment.geography}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Impact Highlights:</p>
                    <ul className="space-y-1">
                      {investment.impact.map((item, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <span className="text-green-600 mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Benefits */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Investor Benefits</h2>
            <p className="text-base sm:text-lg md:text-xl text-primary-100">
              Join our community of global investors building Africa's future
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <ArrowTrendingUpIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Superior Returns</h3>
              <p className="text-primary-100">
                Access to high-growth African markets with proven track record of outperforming benchmarks
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <ShieldCheckIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Transparent Reporting</h3>
              <p className="text-primary-100">
                Quarterly performance reports, annual audits, and 24/7 access to your portfolio dashboard
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Exclusive Opportunities</h3>
              <p className="text-primary-100">
                Early access to pre-IPO investments and private deals across Africa's fastest-growing sectors
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center">
              Start Investing
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/register" className="btn-outline border-white text-white hover:bg-white/10">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
