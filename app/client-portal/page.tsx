'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { AssetAllocationChart } from '@/components/charts/AssetAllocationChart';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { generatePortfolioStatement, generateTransactionReport } from '@/lib/pdfGenerator';
import { formatPrimaryAndSecondary } from '@/lib/currency';

interface DashboardData {
  portfolio: {
    totalValue: number;
    totalGain: number;
    totalGainPercent: number;
    holdings: Array<{
      name: string;
      type: string;
      value: number;
      allocation: number;
      change: number;
    }>;
  } | null;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    status: string;
    date: string;
    investmentType?: string;
    commodityCompany?: string;
    returnRate?: number;
    maturityDate?: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
    date: string;
  }>;
}

export default function ClientPortal() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Auto-refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        console.log('Page visible again, refreshing data...');
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      console.log('Fetching dashboard data...');
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        cache: 'no-store', // Prevent caching
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data received:', {
          portfolioValue: data.portfolio?.totalValue,
          transactionsCount: data.transactions?.length,
          documentsCount: data.documents?.length,
        });
        setDashboardData(data);
      } else {
        console.error('Dashboard fetch failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      await login(loginForm.email, loginForm.password);
      // Note: After successful login, the useEffect below will handle redirect
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Redirect admin users to admin portal after login
  useEffect(() => {
    if (isAuthenticated && (user as any)?.role === 'admin') {
      console.log('Admin user detected, redirecting to admin portal...');
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 section-padding">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Client Portal
              </h1>
              <p className="text-gray-600">
                Sign in to access your investment account
              </p>
            </div>

            {loginError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    className="input-field pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-.718.116-1.413.333-2.07M6.228 6.228A9.958 9.958 0 0112 5c5 0 9 4 9 7 0 1.09-.353 2.191-1.006 3.228M9.88 9.88a3 3 0 014.24 4.24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loggingIn ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Not a client yet?{' '}
              <a href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard View
  if (loadingData || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const portfolio = dashboardData.portfolio;

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fetchDashboardData()}
                disabled={loadingData}
                className="btn-outline text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
                title="Refresh data"
              >
                <svg className={`h-4 w-4 ${loadingData ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">{loadingData ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              {portfolio && dashboardData && (
                <button
                  onClick={() => generatePortfolioStatement(
                    {
                      userName: user?.name || '',
                      accountType: user?.accountType || 'Individual',
                      totalValue: portfolio.totalValue,
                      totalGain: portfolio.totalGain,
                      totalGainPercent: portfolio.totalGainPercent,
                      holdings: portfolio.holdings
                    },
                    dashboardData.transactions
                  )}
                  className="btn-outline text-xs sm:text-sm whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Download Statement</span>
                  <span className="sm:hidden">Statement</span>
                </button>
              )}
              <button
                onClick={() => logout()}
                className="btn-outline text-xs sm:text-sm whitespace-nowrap"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {portfolio ? (
          <>
            {/* Show helpful message if portfolio is empty */}
            {portfolio.totalValue === 0 && dashboardData.transactions.length === 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-blue-900">Welcome to CapitalMasters!</h3>
                    <p className="mt-2 text-sm text-blue-700">
                      Your investment account is ready. Our team will set up your portfolio and investments shortly. 
                      You'll see your data here once it's been configured by our administrators.
                    </p>
                    <p className="mt-2 text-sm text-blue-700">
                      In the meantime, feel free to explore the platform or contact your advisor if you have any questions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {user?.email === 'ronaldopa323@gmail.com' ? (
                // Ronald just invested - show Expected May Payout
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-xs sm:text-sm font-semibold">Expected May Payout</span>
                    <BanknotesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                      {(() => {
                        const contributions = dashboardData.transactions.filter(t => 
                          ['deposit', 'investment', 'loan_given'].includes(t.type)
                        );
                        const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
                        const totalSeasonPayout = totalContributions * 0.08 * 4; // 32% for 4 months
                        const v = formatPrimaryAndSecondary(totalSeasonPayout);
                        return (
                          <>
                            <span className="font-semibold">{v.primary}</span>
                            <div className="text-xs text-gray-500">{v.secondary}</div>
                          </>
                        );
                      })()}
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <div className="font-semibold text-purple-600">Payment: May 23-30, 2026</div>
                    <div className="text-xs text-gray-500">4-Month Cycle (Jan-Apr 2026)</div>
                  </div>
                </div>
              ) : (
                // Other investors - show January Payout
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-xs sm:text-sm font-semibold">Expected January Payout</span>
                    <BanknotesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                      {(() => {
                        // Calculate net invested amount from transactions
                        const contributions = dashboardData.transactions.filter(t => 
                          ['deposit', 'investment', 'loan_given'].includes(t.type)
                        );
                        const payouts = dashboardData.transactions.filter(t => 
                          ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
                        );
                        const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
                        const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
                        const netInvested = totalContributions - totalPayouts;
                        
                        // Calculate payout for 4-month season
                        // 8% per month × 4 months = 32% total
                        const netPayoutPerMonth = netInvested * 0.08;
                        const totalSeasonPayout = netPayoutPerMonth * 4;
                        const v = formatPrimaryAndSecondary(totalSeasonPayout);
                        return (
                          <>
                            <span className="font-semibold">{v.primary}</span>
                            <div className="text-xs text-gray-500">{v.secondary}</div>
                          </>
                        );
                      })()}
                  </div>
                  <div className="mt-3 text-xs text-gray-600 space-y-1">
                    <div className="font-semibold text-purple-600">Payment: Jan 23-30, 2026</div>
                    <div className="text-xs text-gray-500 mb-2">4-Month Season Returns (Sep-Dec 2025)</div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span>Gross Return (10%/month):</span>
                        <span className="font-semibold">
                          {(() => {
                            const contributions = dashboardData.transactions.filter(t => 
                              ['deposit', 'investment', 'loan_given'].includes(t.type)
                            );
                            const payouts = dashboardData.transactions.filter(t => 
                              ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
                            );
                            const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
                            const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
                            const netInvested = totalContributions - totalPayouts;
                            return formatPrimaryAndSecondary(netInvested * 0.10).primary;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Fees (2%/month):</span>
                        <span className="font-semibold">
                          -{(() => {
                            const contributions = dashboardData.transactions.filter(t => 
                              ['deposit', 'investment', 'loan_given'].includes(t.type)
                            );
                            const payouts = dashboardData.transactions.filter(t => 
                              ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
                            );
                            const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
                            const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
                            const netInvested = totalContributions - totalPayouts;
                            return formatPrimaryAndSecondary(netInvested * 0.02).primary;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-blue-600 border-t pt-1 mt-1">
                        <span>Net Per Month (8%):</span>
                        <span>
                          {(() => {
                            const contributions = dashboardData.transactions.filter(t => 
                              ['deposit', 'investment', 'loan_given'].includes(t.type)
                            );
                            const payouts = dashboardData.transactions.filter(t => 
                              ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
                            );
                            const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
                            const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
                            const netInvested = totalContributions - totalPayouts;
                            return formatPrimaryAndSecondary(netInvested * 0.08).primary;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-green-600 text-base border-t-2 pt-2 mt-2">
                        <span>Total 4-Month Payout (32%):</span>
                        <span>
                          {(() => {
                            const contributions = dashboardData.transactions.filter(t => 
                              ['deposit', 'investment', 'loan_given'].includes(t.type)
                            );
                            const payouts = dashboardData.transactions.filter(t => 
                              ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
                            );
                            const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
                            const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
                            const netInvested = totalContributions - totalPayouts;
                            return formatPrimaryAndSecondary(netInvested * 0.08 * 4).primary;
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 italic">
                      *Fees cover transaction costs, taxes, service charges, and operational expenses
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs sm:text-sm font-semibold">Total Contributions</span>
                  <ArrowTrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {(() => {
                      // Calculate total contributions (deposits, investments, loans given)
                      const contributions = dashboardData.transactions.filter(t => 
                        ['deposit', 'investment', 'loan_given'].includes(t.type)
                      );
                      const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
                      const v = formatPrimaryAndSecondary(totalContributions);
                      return (
                        <>
                          <span className="font-semibold">{v.primary}</span>
                          <div className="text-xs text-gray-500">{v.secondary}</div>
                        </>
                      );
                    })()}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs sm:text-sm font-semibold">Total Payouts</span>
                  <ArrowTrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    {(() => {
                      // Calculate total payouts (withdrawals, dividends, interest, loan repayments)
                      const payouts = dashboardData.transactions.filter(t => 
                        ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
                      );
                      const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
                      const v = formatPrimaryAndSecondary(totalPayouts);
                      return (
                        <>
                          <span className="font-semibold">{v.primary}</span>
                          <div className="text-xs text-gray-500">{v.secondary}</div>
                        </>
                      );
                    })()}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs sm:text-sm font-semibold">Net Invested</span>
                  <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {(() => {
                      // Calculate net invested (contributions - payouts)
                      const contributions = dashboardData.transactions.filter(t => 
                        ['deposit', 'investment', 'loan_given'].includes(t.type)
                      );
                      const payouts = dashboardData.transactions.filter(t => 
                        ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
                      );
                      const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
                      const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
                      const netInvested = totalContributions - totalPayouts;
                      const v = formatPrimaryAndSecondary(netInvested);
                      return (
                        <>
                          <span className="font-semibold">{v.primary}</span>
                          <div className="text-xs text-gray-500">{v.secondary}</div>
                        </>
                      );
                    })()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* Investment Breakdown */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Investment Breakdown
                </h2>
                <div className="space-y-4">
                  {(() => {
                    // Calculate actual breakdown from transactions
                    const commoditiesTotal = dashboardData.transactions
                      .filter(t => t.type === 'deposit' && t.investmentType === 'commodities')
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    const equityTotal = dashboardData.transactions
                      .filter(t => t.type === 'deposit' && t.investmentType === 'equity')
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    const totalInvested = commoditiesTotal + equityTotal;
                    
                    // Get unique commodities from transactions
                    const commodityTypes = [...new Set(
                      dashboardData.transactions
                        .filter(t => t.investmentType === 'commodities' && t.commodityCompany)
                        .map(t => t.commodityCompany)
                    )];

                    const investments = [];
                    
                    // Add commodities if any
                    if (commoditiesTotal > 0) {
                      if (commodityTypes.length > 0) {
                        // Show individual commodities
                        commodityTypes.forEach(commodity => {
                          const commodityAmount = dashboardData.transactions
                            .filter(t => t.commodityCompany === commodity)
                            .reduce((sum, t) => sum + t.amount, 0);
                          
                          const allocation = totalInvested > 0 ? (commodityAmount / totalInvested * 100).toFixed(1) : '0';
                          
                          investments.push({
                            name: `${commodity} Commodities`,
                            type: 'Commodities Trading',
                            value: commodityAmount,
                            allocation: parseFloat(allocation),
                            description: 'Fixed-term commodity trading investment'
                          });
                        });
                      } else {
                        // Show general commodities
                        const allocation = totalInvested > 0 ? (commoditiesTotal / totalInvested * 100).toFixed(1) : '0';
                        investments.push({
                          name: 'Commodities Portfolio',
                          type: 'Commodities Trading',
                          value: commoditiesTotal,
                          allocation: parseFloat(allocation),
                          description: 'Diversified commodity trading investments'
                        });
                      }
                    }
                    
                    // Add equity if any
                    if (equityTotal > 0) {
                      const allocation = totalInvested > 0 ? (equityTotal / totalInvested * 100).toFixed(1) : '0';
                      investments.push({
                        name: 'Equity Investments',
                        type: 'Equity',
                        value: equityTotal,
                        allocation: parseFloat(allocation),
                        description: 'Stock market and equity holdings'
                      });
                    }

                    // Show message if no investments
                    if (investments.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">Your investments will appear here once processed by our team.</p>
                        </div>
                      );
                    }

                    return investments.map((investment, idx) => (
                      <div key={idx} className="border-b pb-4 last:border-b-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">
                                  {investment.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{investment.name}</h3>
                                <p className="text-xs text-gray-500">{investment.type}</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 ml-12">
                              {investment.description}
                            </p>
                          </div>
                          <div className="text-left sm:text-right ml-12 sm:ml-0">
                            <div className="font-bold text-gray-900 text-sm sm:text-base">
                              {(() => {
                                const v = formatPrimaryAndSecondary(investment.value);
                                return (
                                  <>
                                    <span>{v.primary}</span>
                                    <div className="text-xs text-gray-500">{v.secondary}</div>
                                  </>
                                );
                              })()}
                            </div>
                            <div className="text-xs text-purple-600 font-semibold mt-1">
                              {investment.allocation}% of total
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${investment.allocation}%` }}
                          />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                
                {/* Investment Summary */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Invested Capital</span>
                    <span className="font-bold text-gray-900">
                      {(() => {
                        const totalInvested = dashboardData.transactions
                          .filter(t => t.type === 'deposit')
                          .reduce((sum, t) => sum + t.amount, 0);
                        return formatPrimaryAndSecondary(totalInvested).primary;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">Current Value</span>
                    <span className="font-bold text-green-600">
                      {formatPrimaryAndSecondary(portfolio.totalValue).primary}
                    </span>
                  </div>
                </div>
              </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Recent Transactions
            </h2>
            <div className="space-y-4">
              {dashboardData.transactions.length > 0 ? (
                dashboardData.transactions.map((transaction) => {
                  const isCommodity = transaction.investmentType === 'commodities';
                  const isInvestment = transaction.type === 'investment' || transaction.investmentType;
                  
                  return (
                    <div key={transaction.id} className={`border rounded-lg p-3 sm:p-4 ${isCommodity ? 'bg-amber-50 border-amber-200' : 'bg-white'}`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`${isCommodity ? 'bg-amber-200' : 'bg-primary-100'} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <ClockIcon className={`h-5 w-5 ${isCommodity ? 'text-amber-700' : 'text-primary-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {transaction.description}
                              </h3>
                              {isInvestment && transaction.investmentType && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                                  {transaction.investmentType.replace('_', ' ')}
                                </span>
                              )}
                              {transaction.status === 'pending' && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                  Pending
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {new Date(transaction.date).toLocaleDateString()} • {transaction.type.replace('_', ' ')}
                            </p>
                            
                            {/* Commodity Investment Details */}
                            {isCommodity && transaction.commodityCompany && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-amber-700 font-medium">
                                  🌾 {transaction.commodityCompany}
                                </p>
                                {transaction.returnRate && (
                                  <div className="text-xs text-gray-700 bg-white rounded p-2 space-y-1">
                                    <p><strong>Return Rate:</strong> {transaction.returnRate}% monthly</p>
                                    <p><strong>Investor Payout:</strong> 8% monthly (32% per 4 months)</p>
                                    <p><strong>Admin Fee:</strong> 2% monthly (8% per 4 months)</p>
                                    {transaction.type === 'investment' && (
                                      <>
                                        <div className="border-t pt-1 mt-1">
                                          <p className="font-medium">Expected Returns (4-month cycle):</p>
                                          <p>• Your Payout: UGX {(transaction.amount * 0.32).toLocaleString()}</p>
                                          <p>• Total Value: UGX {(transaction.amount * 1.32).toLocaleString()}</p>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                                {transaction.maturityDate && (
                                  <p className="text-xs text-amber-700">
                                    <strong>Next Payout:</strong> {new Date(transaction.maturityDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {/* Other Investment Details */}
                            {isInvestment && !isCommodity && transaction.returnRate && (
                              <div className="mt-2 text-xs text-gray-700 bg-blue-50 rounded p-2">
                                <p><strong>Expected Return:</strong> {transaction.returnRate}% annually</p>
                                {transaction.maturityDate && (
                                  <p><strong>Maturity Date:</strong> {new Date(transaction.maturityDate).toLocaleDateString()}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`font-bold text-right ml-4 ${
                          transaction.type === 'deposit' || transaction.type === 'dividend' || transaction.type === 'interest' 
                            ? 'text-green-600' 
                            : transaction.type === 'withdrawal' 
                            ? 'text-red-600'
                            : 'text-gray-900'
                        }`}>
                          {(transaction.type === 'deposit' || transaction.type === 'dividend' || transaction.type === 'interest') && '+'}
                          {transaction.type === 'withdrawal' && '-'}
                          {(() => {
                            const v = formatPrimaryAndSecondary(Math.abs(transaction.amount));
                            return (
                              <>
                                <div>{v.primary}</div>
                                <div className="text-xs text-gray-500 font-normal">{v.secondary}</div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 text-center py-4">No transactions yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Asset Allocation
            </h2>
            {(() => {
              // Calculate asset allocation from transactions
              const commoditiesTotal = dashboardData.transactions
                .filter(t => t.investmentType === 'commodities')
                .reduce((sum, t) => sum + t.amount, 0);
              
              const equityTotal = dashboardData.transactions
                .filter(t => t.investmentType === 'equity')
                .reduce((sum, t) => sum + t.amount, 0);
              
              const realEstateTotal = dashboardData.transactions
                .filter(t => t.investmentType === 'real_estate')
                .reduce((sum, t) => sum + t.amount, 0);
              
              const totalInvestments = commoditiesTotal + equityTotal + realEstateTotal;
              
              const allocations = [
                {
                  name: 'Commodities',
                  value: commoditiesTotal,
                  percentage: totalInvestments > 0 ? (commoditiesTotal / totalInvestments * 100).toFixed(1) : '0',
                  color: 'from-amber-400 to-orange-500',
                  icon: '🌾',
                  description: 'Coffee, Cocoa & Agricultural products'
                },
                {
                  name: 'Securities',
                  value: equityTotal,
                  percentage: totalInvestments > 0 ? (equityTotal / totalInvestments * 100).toFixed(1) : '0',
                  color: 'from-blue-400 to-indigo-500',
                  icon: '📈',
                  description: 'Stocks, Bonds, Treasury Bills'
                },
                {
                  name: 'Real Estate',
                  value: realEstateTotal,
                  percentage: totalInvestments > 0 ? (realEstateTotal / totalInvestments * 100).toFixed(1) : '0',
                  color: 'from-green-400 to-emerald-500',
                  icon: '🏢',
                  description: 'Property investments'
                }
              ].filter(a => parseFloat(a.percentage) > 0);

              if (allocations.length === 0) {
                return (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">Asset allocation will be displayed once your investments are processed.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {allocations.map((asset, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${asset.color} flex items-center justify-center text-2xl`}>
                            {asset.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                            <p className="text-xs text-gray-500">{asset.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{asset.percentage}%</div>
                          <div className="text-xs text-gray-500">
                            {formatPrimaryAndSecondary(asset.value).primary}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className={`bg-gradient-to-r ${asset.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${asset.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Summary */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Total Invested</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrimaryAndSecondary(totalInvestments).primary}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Diversified across {allocations.length} asset {allocations.length === 1 ? 'class' : 'classes'}
                    </div>
                  </div>
                  
                  {/* Available Investment Options Notice */}
                  {allocations.length < 3 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-blue-700">
                        <strong>Diversification Opportunity:</strong> We offer investments in{' '}
                        {(() => {
                          const missing = [];
                          if (!allocations.find(a => a.name === 'Commodities')) missing.push('Commodities');
                          if (!allocations.find(a => a.name === 'Securities')) missing.push('Securities');
                          if (!allocations.find(a => a.name === 'Real Estate')) missing.push('Real Estate');
                          
                          if (missing.length === 1) return missing[0];
                          if (missing.length === 2) return `${missing[0]} and ${missing[1]}`;
                          return `${missing[0]}, ${missing[1]}, and ${missing[2]}`;
                        })()}
                        . Contact your advisor to explore additional options.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Returns Timeline (Sep-Dec 2025 Cycle)
            </h2>
            {(() => {
              // Calculate net invested amount
              const contributions = dashboardData.transactions.filter(t => 
                ['deposit', 'investment', 'loan_given'].includes(t.type)
              );
              const payouts = dashboardData.transactions.filter(t => 
                ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
              );
              const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
              const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
              const netInvested = totalContributions - totalPayouts;

              // Check if investor started in 2025 (eligible for Jan 2026 payout)
              const oldestTransaction = dashboardData.transactions
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
              
              const investmentDate = oldestTransaction ? new Date(oldestTransaction.date) : new Date();
              const isEligibleFor2026Payout = investmentDate.getFullYear() === 2025 || investmentDate.getFullYear() < 2025;
              
              if (!isEligibleFor2026Payout || user?.email === 'ronaldopa323@gmail.com') {
                // Ronald's Jan-April 2026 timeline
                if (user?.email === 'ronaldopa323@gmail.com') {
                  const timeline = [
                    {
                      month: 'Jan 2026',
                      label: 'Month 1',
                      value: netInvested,
                      growth: 0,
                      status: 'active',
                      description: 'Investment active'
                    },
                    {
                      month: 'Feb 2026',
                      label: 'Month 2',
                      value: netInvested * 1.08,
                      growth: 8,
                      status: 'pending',
                      description: '+8% accrual pending'
                    },
                    {
                      month: 'Mar 2026',
                      label: 'Month 3',
                      value: netInvested * 1.16,
                      growth: 16,
                      status: 'pending',
                      description: '+16% accrual pending'
                    },
                    {
                      month: 'Apr 2026',
                      label: 'Month 4',
                      value: netInvested * 1.24,
                      growth: 24,
                      status: 'pending',
                      description: '+24% accrual pending'
                    },
                    {
                      month: 'May 2026',
                      label: 'Payout',
                      value: netInvested * 0.32,
                      growth: 32,
                      status: 'pending',
                      description: '32% payout scheduled'
                    }
                  ];
                  
                  return (
                    <div className="space-y-6">
                      {/* Timeline visualization */}
                      <div className="relative">
                        {timeline.map((item, idx) => (
                          <div key={idx} className="flex items-start mb-6 last:mb-0">
                            {/* Timeline dot and line */}
                            <div className="flex flex-col items-center mr-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                item.status === 'active' 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-300'
                              }`}>
                                {item.status === 'active' ? (
                                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                ) : (
                                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>
                              {idx < timeline.length - 1 && (
                                <div className={`w-0.5 h-16 ${item.status === 'active' ? 'bg-blue-300' : 'bg-gray-300'}`} />
                              )}
                            </div>

                            {/* Timeline content */}
                            <div className="flex-1 pb-6">
                              <div className="bg-gray-50 rounded-lg p-4 border-l-4" style={{
                                borderColor: item.status === 'active' ? '#3b82f6' : '#d1d5db'
                              }}>
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{item.month}</h3>
                                    <p className="text-sm text-gray-600">{item.label}</p>
                                  </div>
                                  {item.growth > 0 && (
                                    <span className={`text-sm font-semibold px-2 py-1 rounded ${
                                      item.status === 'active' 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      +{item.growth}%
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                                <div className="text-lg font-bold text-gray-900">
                                  {formatPrimaryAndSecondary(item.value).primary}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary card */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900">Cycle Summary</h3>
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                            In Progress
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Investment Period</p>
                            <p className="font-semibold text-gray-900">Jan - Apr 2026</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Expected Payout</p>
                            <p className="font-semibold text-green-600">{formatPrimaryAndSecondary(netInvested * 0.32).primary}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Principal Amount</p>
                            <p className="font-semibold text-gray-900">{formatPrimaryAndSecondary(netInvested).primary}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Payout Date</p>
                            <p className="font-semibold text-purple-600">May 23-30, 2026</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // For other non-2025 investors
                return (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Investment Started {investmentDate.getFullYear()}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your 4-month investment cycle is in progress. Returns timeline will be available after your first complete cycle.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-700">Next payout cycle: May 2026</span>
                    </div>
                  </div>
                );
              }

              // Timeline for 2025 investors receiving Jan 2026 payout
              const timeline = [
                {
                  month: 'Sep 2025',
                  label: 'Month 1',
                  value: netInvested,
                  growth: 0,
                  status: 'completed',
                  description: 'Investment active'
                },
                {
                  month: 'Oct 2025',
                  label: 'Month 2',
                  value: netInvested * 1.08,
                  growth: 8,
                  status: 'completed',
                  description: '+8% accrued'
                },
                {
                  month: 'Nov 2025',
                  label: 'Month 3',
                  value: netInvested * 1.16,
                  growth: 16,
                  status: 'completed',
                  description: '+16% accrued'
                },
                {
                  month: 'Dec 2025',
                  label: 'Month 4',
                  value: netInvested * 1.24,
                  growth: 24,
                  status: 'completed',
                  description: '+24% accrued'
                },
                {
                  month: 'Jan 2026',
                  label: 'Payout',
                  value: netInvested * 0.32,
                  growth: 32,
                  status: 'pending',
                  description: '32% payout pending'
                }
              ];

              return (
                <div className="space-y-6">
                  {/* Timeline visualization */}
                  <div className="relative">
                    {timeline.map((item, idx) => (
                      <div key={idx} className="flex items-start mb-6 last:mb-0">
                        {/* Timeline dot and line */}
                        <div className="flex flex-col items-center mr-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.status === 'completed' 
                              ? 'bg-green-500' 
                              : 'bg-yellow-500 animate-pulse'
                          }`}>
                            {item.status === 'completed' ? (
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          {idx < timeline.length - 1 && (
                            <div className={`w-0.5 h-16 ${item.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'}`} />
                          )}
                        </div>

                        {/* Timeline content */}
                        <div className="flex-1 pb-6">
                          <div className="bg-gray-50 rounded-lg p-4 border-l-4" style={{
                            borderColor: item.status === 'completed' ? '#10b981' : '#eab308'
                          }}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">{item.month}</h3>
                                <p className="text-sm text-gray-600">{item.label}</p>
                              </div>
                              {item.growth > 0 && (
                                <span className={`text-sm font-semibold px-2 py-1 rounded ${
                                  item.status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-700' 
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  +{item.growth}%
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrimaryAndSecondary(item.value).primary}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary card */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Cycle Summary</h3>
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        4-Month Complete
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Investment Period</p>
                        <p className="font-semibold text-gray-900">Sep - Dec 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Expected Payout</p>
                        <p className="font-semibold text-green-600">{formatPrimaryAndSecondary(netInvested * 0.32).primary}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Principal Amount</p>
                        <p className="font-semibold text-gray-900">{formatPrimaryAndSecondary(netInvested).primary}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Payout Date</p>
                        <p className="font-semibold text-purple-600">Jan 23-30, 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Investment Documents</h2>
            <DocumentTextIcon className="h-6 w-6 text-primary-600" />
          </div>
          
          {(() => {
            // Generate realistic documents based on investment history
            const contributions = dashboardData.transactions.filter(t => 
              ['deposit', 'investment', 'loan_given'].includes(t.type)
            );
            const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
            
            // Check if eligible for cycle completion certificate
            const oldestTransaction = dashboardData.transactions
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
            
            const investmentDate = oldestTransaction ? new Date(oldestTransaction.date) : new Date();
            const isEligibleForCertificate = investmentDate.getFullYear() === 2025 || investmentDate.getFullYear() < 2025;
            
            const documents = [
              {
                id: 'agreement',
                name: 'Investment Agreement',
                type: 'PDF',
                category: 'Legal',
                icon: '📄',
                color: 'blue',
                description: 'Terms and conditions of your investment',
                date: investmentDate,
                size: 245,
                available: true
              },
              {
                id: 'welcome',
                name: 'Investor Welcome Pack',
                type: 'PDF',
                category: 'Info',
                icon: '📋',
                color: 'purple',
                description: 'Getting started guide and important information',
                date: investmentDate,
                size: 1024,
                available: true
              }
            ];

            // Add cycle completion certificate for eligible investors
            if (isEligibleForCertificate && user?.email !== 'ronaldopa323@gmail.com') {
              documents.push({
                id: 'cycle-cert',
                name: 'Sep-Dec 2025 Cycle Certificate',
                type: 'PDF',
                category: 'Statement',
                icon: '🏆',
                color: 'green',
                description: '4-month investment cycle completion certificate',
                date: new Date('2025-12-31'),
                size: 189,
                available: true
              });
              
              documents.push({
                id: 'payout-statement',
                name: 'January 2026 Payout Statement',
                type: 'PDF',
                category: 'Financial',
                icon: '💰',
                color: 'amber',
                description: 'Detailed breakdown of your 32% return payout',
                date: new Date('2026-01-15'),
                size: 156,
                available: true
              });
            }

            // Add transaction history
            if (dashboardData.transactions.length > 0) {
              documents.push({
                id: 'transaction-history',
                name: 'Transaction History Report',
                type: 'PDF',
                category: 'Financial',
                icon: '📊',
                color: 'indigo',
                description: 'Complete record of all deposits and transactions',
                date: new Date(),
                size: 312,
                available: true
              });
            }

            // Add tax certificate if eligible
            if (isEligibleForCertificate && totalContributions > 0 && user?.email !== 'ronaldopa323@gmail.com') {
              documents.push({
                id: 'tax-cert',
                name: '2025 Tax Certificate',
                type: 'PDF',
                category: 'Tax',
                icon: '🧾',
                color: 'red',
                description: 'Income tax certificate for 2025 returns',
                date: new Date('2026-01-10'),
                size: 98,
                available: true
              });
            }

            const colorClasses = {
              blue: 'bg-blue-100 text-blue-700 border-blue-200',
              purple: 'bg-purple-100 text-purple-700 border-purple-200',
              green: 'bg-green-100 text-green-700 border-green-200',
              amber: 'bg-amber-100 text-amber-700 border-amber-200',
              indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
              red: 'bg-red-100 text-red-700 border-red-200'
            };

            return (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className={`border rounded-lg p-4 hover:shadow-md transition-all ${colorClasses[doc.color as keyof typeof colorClasses]}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="text-3xl flex-shrink-0">
                          {doc.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {doc.name}
                            </h3>
                            <span className="px-2 py-0.5 bg-white bg-opacity-50 rounded text-xs font-medium">
                              {doc.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 mb-2">
                            {doc.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span>{new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{doc.size} KB</span>
                            <span>•</span>
                            <span className="font-medium text-gray-700">{doc.type}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          // Generate and download the document
                          if (doc.id === 'transaction-history') {
                            generateTransactionReport(dashboardData.transactions, user?.name || 'Client');
                          } else if (doc.id === 'payout-statement' || doc.id === 'cycle-cert') {
                            generatePortfolioStatement(
                              {
                                userName: user?.name || '',
                                accountType: (user as any)?.accountType || 'Individual',
                                totalValue: portfolio.totalValue,
                                totalGain: portfolio.totalGain || 0,
                                totalGainPercent: portfolio.totalGainPercent || 0,
                                holdings: portfolio.holdings
                              },
                              dashboardData.transactions
                            );
                          } else {
                            alert(`${doc.name} will be available for download soon. Contact your advisor for immediate access.`);
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium text-gray-700 border border-gray-300"
                        title={`Download ${doc.name}`}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Info message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> New documents are automatically generated at the end of each investment cycle. 
                    If you need additional documents or have questions, please contact your investment advisor.
                  </p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Profile Management */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                Edit Profile
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Type</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {(user as any)?.accountType || 'Individual'} Investment Account
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Tolerance</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {(user as any)?.riskTolerance || 'Moderate'}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-semibold text-gray-900">
                    {(user as any)?.memberSince 
                      ? new Date((user as any).memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                      : 'January 2023'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors flex items-center justify-between group">
                <span className="font-semibold text-gray-900">Make a Contribution</span>
                <svg className="h-5 w-5 text-primary-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between group">
                <span className="font-semibold text-gray-900">Request Withdrawal</span>
                <svg className="h-5 w-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between group">
                <span className="font-semibold text-gray-900">Update Investment Strategy</span>
                <svg className="h-5 w-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between group">
                <span className="font-semibold text-gray-900">Schedule Consultation</span>
                <svg className="h-5 w-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between group">
                <span className="font-semibold text-gray-900">Tax Documents</span>
                <svg className="h-5 w-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Contact Advisor */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
          <p className="text-primary-100 mb-6">
            Your dedicated advisor is here to assist you with any questions.
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            Contact Your Advisor
          </button>
        </div>
          </>
        ) : null}
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdate={(updatedUser) => {
          // Update user context with new data
          // This will be handled by the modal's success callback
        }}
      />
    </div>
  );
}
