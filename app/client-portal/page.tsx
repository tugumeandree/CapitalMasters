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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchDashboardData()}
                disabled={loadingData}
                className="btn-outline text-sm flex items-center gap-2"
                title="Refresh data"
              >
                <svg className={`h-4 w-4 ${loadingData ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loadingData ? 'Refreshing...' : 'Refresh'}
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
                  className="btn-outline text-sm"
                >
                  Download Statement
                </button>
              )}
              <button
                onClick={() => logout()}
                className="btn-outline"
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
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Total Value</span>
                  <BanknotesIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                    {(() => {
                      const v = formatPrimaryAndSecondary(portfolio.totalValue);
                      return (
                        <>
                          <span className="font-semibold">{v.primary}</span>
                          <div className="text-xs text-gray-500">{v.secondary}</div>
                        </>
                      );
                    })()}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Total Contributions</span>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">
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

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Total Payouts</span>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
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

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Net Invested</span>
                  <ChartBarIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600">
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

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Holdings */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Portfolio Holdings
                </h2>
                <div className="space-y-4">
                  {portfolio.holdings.map((holding, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{holding.name}</h3>
                          <p className="text-sm text-gray-600">
                            {holding.type} • {holding.allocation}% of portfolio
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                              {(() => {
                                const v = formatPrimaryAndSecondary(holding.value);
                                return (
                                  <>
                                    <span>{v.primary}</span>
                                    <div className="text-xs text-gray-500">{v.secondary}</div>
                                  </>
                                );
                              })()}
                          </div>
                          <div className={`text-sm ${holding.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.change > 0 ? '+' : ''}{holding.change}%
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${holding.allocation}%` }}
                        />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Transactions
            </h2>
            <div className="space-y-4">
              {dashboardData.transactions.length > 0 ? (
                dashboardData.transactions.map((transaction) => {
                  const isCommodity = transaction.investmentType === 'commodities';
                  const isInvestment = transaction.type === 'investment' || transaction.investmentType;
                  
                  return (
                    <div key={transaction.id} className={`border rounded-lg p-4 ${isCommodity ? 'bg-amber-50 border-amber-200' : 'bg-white'}`}>
                      <div className="flex justify-between items-start mb-2">
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
            <AssetAllocationChart holdings={portfolio.holdings} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Portfolio Performance
            </h2>
            <PerformanceChart 
              data={[
                { month: 'Jan', value: portfolio.totalValue * 0.85, benchmark: portfolio.totalValue * 0.87 },
                { month: 'Feb', value: portfolio.totalValue * 0.88, benchmark: portfolio.totalValue * 0.89 },
                { month: 'Mar', value: portfolio.totalValue * 0.90, benchmark: portfolio.totalValue * 0.91 },
                { month: 'Apr', value: portfolio.totalValue * 0.93, benchmark: portfolio.totalValue * 0.93 },
                { month: 'May', value: portfolio.totalValue * 0.95, benchmark: portfolio.totalValue * 0.95 },
                { month: 'Jun', value: portfolio.totalValue, benchmark: portfolio.totalValue * 0.97 },
              ]}
            />
          </div>
        </div>

        {/* Investment Breakdown by Type */}
        {dashboardData.transactions.some(t => t.investmentType) && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Investment Breakdown
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                // Calculate totals by investment type
                const investmentsByType: Record<string, { total: number; count: number }> = {};
                dashboardData.transactions.forEach(t => {
                  if (t.investmentType && t.type === 'investment') {
                    if (!investmentsByType[t.investmentType]) {
                      investmentsByType[t.investmentType] = { total: 0, count: 0 };
                    }
                    investmentsByType[t.investmentType].total += t.amount;
                    investmentsByType[t.investmentType].count += 1;
                  }
                });

                return Object.entries(investmentsByType).map(([type, data]) => {
                  const isCommodity = type === 'commodities';
                  return (
                    <div key={type} className={`border rounded-lg p-4 ${isCommodity ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 capitalize text-sm">
                          {type.replace('_', ' ')}
                        </h3>
                        <span className={`px-2 py-1 ${isCommodity ? 'bg-amber-200 text-amber-700' : 'bg-blue-100 text-blue-700'} text-xs rounded-full`}>
                          {data.count} {data.count === 1 ? 'investment' : 'investments'}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {(() => {
                          const v = formatPrimaryAndSecondary(data.total);
                          return (
                            <>
                              <div>{v.primary}</div>
                              <div className="text-xs text-gray-500 font-normal">{v.secondary}</div>
                            </>
                          );
                        })()}
                      </div>
                      {isCommodity && (
                        <div className="mt-2 pt-2 border-t border-amber-300">
                          <p className="text-xs text-amber-700">
                            <strong>Expected 4-month return:</strong>
                          </p>
                          <p className="text-xs text-amber-900 font-medium">
                            UGX {(data.total * 0.32).toLocaleString()} (32%)
                          </p>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
          </>
        ) : null}

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
            <DocumentTextIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {dashboardData.documents.length > 0 ? (
              dashboardData.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 w-10 h-10 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold text-xs uppercase">{doc.type}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {new Date(doc.date).toLocaleDateString()} • {(doc.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4 col-span-2">No documents available</p>
            )}
          </div>
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
