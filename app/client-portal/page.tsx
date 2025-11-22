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

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
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
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

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

            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              <strong>Demo Credentials:</strong><br />
              Email: demo@capitalmasters.com<br />
              Password: demo123
            </div>

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
                <input
                  type="password"
                  id="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
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
        {portfolio && (
          <>
            {/* Portfolio Summary */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Total Value</span>
                  <BanknotesIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ${portfolio.totalValue.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Total Gain</span>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  ${portfolio.totalGain.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Total Return</span>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  +{portfolio.totalGainPercent}%
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Holdings</span>
                  <ChartBarIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {portfolio.holdings.length}
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
                            ${holding.value.toLocaleString()}
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
                dashboardData.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {transaction.description}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.type}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                ))
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
          </>
        )}

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-md p-6">
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
                  <p className="font-semibold text-gray-900">Individual Investment Account</p>
                </div>
              </div>
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Tolerance</p>
                  <p className="font-semibold text-gray-900">Moderate</p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-semibold text-gray-900">January 2023</p>
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
