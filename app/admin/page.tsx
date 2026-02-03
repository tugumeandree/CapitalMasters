'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import UsersTab from '@/components/admin/UsersTab';

type Tab = 'users' | 'portfolios' | 'transactions' | 'deposits';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [targetTotals, setTargetTotals] = useState<Record<string, string>>({});
  const [adjustingUserId, setAdjustingUserId] = useState<string | null>(null);
  const [payoutSelections, setPayoutSelections] = useState<Record<string, string>>({});
  
  // Users tab state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [userViewMode, setUserViewMode] = useState<'cards' | 'table'>('cards');
  const [userSortBy, setUserSortBy] = useState<'name' | 'email' | 'role' | 'portfolio' | 'date' | 'transactions'>('name');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  // Deposits tab state
  const [depositsSearchQuery, setDepositsSearchQuery] = useState('');
  const [depositsSortBy, setDepositsSortBy] = useState<'name' | 'deposits' | 'withdrawals' | 'returns' | 'netInvested'>('name');
  const [depositsSortOrder, setDepositsSortOrder] = useState<'asc' | 'desc'>('asc');

  const formatNumber = (value: number | string | null | undefined) => {
    const num = typeof value === 'string' ? Number(value) : value;
    const safe = Number.isFinite(num as number) ? (num as number) : 0;
    return safe.toLocaleString('en-UG');
  };

  const allowedPayoutMonths = [0, 4, 8]; // Jan, May, Sep (0-based)

  const buildPayoutOptions = () => {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];
    const opts: { label: string; value: string }[] = [];
    years.forEach((yr) => {
      allowedPayoutMonths.forEach((m) => {
        const date = new Date(Date.UTC(yr, m, 1));
        const label = date.toLocaleDateString('en-UG', { year: 'numeric', month: 'long' });
        const value = date.toISOString().split('T')[0];
        opts.push({ label, value });
      });
    });
    return opts;
  };

  const defaultPayoutDate = () => {
    const now = new Date();
    const month = now.getUTCMonth();
    const year = now.getUTCFullYear();
    const nextMonth = allowedPayoutMonths.find((m) => m >= month);
    const targetMonth = nextMonth !== undefined ? nextMonth : allowedPayoutMonths[0];
    const targetYear = nextMonth !== undefined ? year : year + 1;
    return new Date(Date.UTC(targetYear, targetMonth, 1)).toISOString().split('T')[0];
  };

  // Export functions
  const exportToPDF = (data: any[], title: string, columns: string[], rowGenerator: (item: any) => any[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CAPITALMASTERS', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Admin Dashboard Report', pageWidth / 2, 22, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, pageWidth / 2, 28, { align: 'center' });
    
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(title, 14, 48);
    
    // Table
    autoTable(doc, {
      startY: 55,
      head: [columns],
      body: data.map(rowGenerator),
      theme: 'grid',
      headStyles: { 
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    doc.save(`CapitalMasters_${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = (data: any[], title: string, columns: string[], rowGenerator: (item: any) => any[]) => {
    const csvContent = [
      columns.join(','),
      ...data.map(item => rowGenerator(item).map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `CapitalMasters_${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportUsers = (format: 'pdf' | 'excel') => {
    const columns = ['Name', 'Email', 'Role', 'Contact', 'Portfolio Value', 'Expected Payout', 'Payout Month'];
    const rowGenerator = (u: any) => {
      const userPortfolio = portfolios.find(p => p.userId === u._id);
      const userTransactions = transactions.filter(t => t.userId === u._id);
      const oldestTxn = [...userTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      const investmentDate = oldestTxn ? new Date(oldestTxn.date) : new Date();
      const isEligibleFor2026Jan = investmentDate.getFullYear() === 2025 || investmentDate.getFullYear() < 2025;
      const isRonald = u.email === 'ronaldopa323@gmail.com';
      const contributions = userTransactions.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type));
      const payouts = userTransactions.filter(t => ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type));
      const totalContribs = contributions.reduce((sum, t) => sum + t.amount, 0);
      const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
      const netInvested = totalContribs - totalPayouts;
      const expectedPayout = netInvested * 0.32;
      const payoutMonth = isRonald ? 'May 2026' : (isEligibleFor2026Jan ? 'Jan 2026' : 'May 2026');
      
      return [
        u.name || 'N/A',
        u.email,
        u.role === 'admin' ? 'Admin' : 'User',
        u.contact || 'N/A',
        u.role !== 'admin' ? `UGX ${formatNumber(userPortfolio?.totalValue || 0)}` : 'N/A',
        u.role !== 'admin' ? `UGX ${formatNumber(expectedPayout)}` : 'N/A',
        u.role !== 'admin' ? payoutMonth : 'N/A'
      ];
    };
    
    if (format === 'pdf') {
      exportToPDF(users, 'Users Report', columns, rowGenerator);
    } else {
      exportToExcel(users, 'Users Report', columns, rowGenerator);
    }
  };

  const exportDeposits = (format: 'pdf' | 'excel') => {
    const deposits = users.filter(u => u.role !== 'admin').map(u => {
      const userTransactions = transactions.filter(t => t.userId === u._id);
      const depositTxns = userTransactions.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type));
      const totalDeposits = depositTxns.reduce((sum, t) => sum + t.amount, 0);
      return { user: u, total: totalDeposits, count: depositTxns.length };
    });
    
    const columns = ['Investor Name', 'Email', 'Total Deposits', 'Number of Deposits'];
    const rowGenerator = (item: any) => [
      item.user.name || 'N/A',
      item.user.email,
      `UGX ${formatNumber(item.total)}`,
      item.count.toString()
    ];
    
    if (format === 'pdf') {
      exportToPDF(deposits, 'Deposits Report', columns, rowGenerator);
    } else {
      exportToExcel(deposits, 'Deposits Report', columns, rowGenerator);
    }
  };

  const exportPortfolios = (format: 'pdf' | 'excel') => {
    const columns = ['User', 'Email', 'Total Value', 'Total Gain', 'Gain %', 'Holdings'];
    const rowGenerator = (p: any) => {
      const user = users.find(u => u._id === p.userId);
      return [
        user?.name || 'N/A',
        user?.email || 'N/A',
        `UGX ${formatNumber(p.totalValue || 0)}`,
        `UGX ${formatNumber(p.totalGain || 0)}`,
        `${p.totalGainPercent || 0}%`,
        (p.holdings?.length || 0).toString()
      ];
    };
    
    if (format === 'pdf') {
      exportToPDF(portfolios, 'Portfolios Report', columns, rowGenerator);
    } else {
      exportToExcel(portfolios, 'Portfolios Report', columns, rowGenerator);
    }
  };

  const exportTransactions = (format: 'pdf' | 'excel') => {
    const columns = ['Date', 'User', 'Type', 'Amount', 'Description', 'Status'];
    const rowGenerator = (t: any) => {
      const user = users.find(u => u._id === t.userId);
      return [
        new Date(t.date).toLocaleDateString('en-US'),
        user?.name || 'N/A',
        t.type,
        `UGX ${formatNumber(Math.abs(t.amount))}`,
        t.description || 'N/A',
        t.status
      ];
    };
    
    if (format === 'pdf') {
      exportToPDF(transactions, 'Transactions Report', columns, rowGenerator);
    } else {
      exportToExcel(transactions, 'Transactions Report', columns, rowGenerator);
    }
  };

  useEffect(() => {
    if (user && (user as any)?.role === 'admin') {
      fetchAllData();
    }
  }, [user]);

  // Redirect non-admin users to admin login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    } else if (!loading && user && (user as any)?.role !== 'admin') {
      router.push('/client-portal');
    }
  }, [loading, user, router]);

  // Compute filtered and sorted investors for deposits tab
  const { filteredInvestors, sortedInvestors } = useMemo(() => {
    const investorsWithData = users.map(investor => {
      const userTransactions = transactions.filter((t) => t.userId === investor._id);
      const deposits = userTransactions.filter((t) => ['deposit', 'investment', 'loan_given'].includes(t.type));
      const withdrawals = userTransactions.filter((t) => t.type === 'withdrawal');
      const returns = userTransactions.filter((t) => ['dividend', 'interest', 'loan_repayment'].includes(t.type));
      const totalDeposits = deposits.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalWithdrawals = withdrawals.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalReturns = returns.reduce((sum, t) => sum + (t.amount || 0), 0);
      const netInvested = totalDeposits - totalWithdrawals;
      return { ...investor, totalDeposits, totalWithdrawals, totalReturns, netInvested };
    });

    // Filter investors
    const filtered = investorsWithData.filter(inv => {
      const matchesSearch = depositsSearchQuery === '' ||
        inv.name?.toLowerCase().includes(depositsSearchQuery.toLowerCase()) ||
        inv.email?.toLowerCase().includes(depositsSearchQuery.toLowerCase());
      return matchesSearch;
    });

    // Sort investors
    const sorted = [...filtered].sort((a, b) => {
      let compareValue = 0;
      switch (depositsSortBy) {
        case 'name':
          compareValue = (a.name || '').localeCompare(b.name || '');
          break;
        case 'deposits':
          compareValue = a.totalDeposits - b.totalDeposits;
          break;
        case 'withdrawals':
          compareValue = a.totalWithdrawals - b.totalWithdrawals;
          break;
        case 'returns':
          compareValue = a.totalReturns - b.totalReturns;
          break;
        case 'netInvested':
          compareValue = a.netInvested - b.netInvested;
          break;
      }
      return depositsSortOrder === 'asc' ? compareValue : -compareValue;
    });

    return { filteredInvestors: filtered, sortedInvestors: sorted };
  }, [users, transactions, depositsSearchQuery, depositsSortBy, depositsSortOrder]);

  // Compute filtered, sorted, and paginated users
  const { filteredUsers, sortedUsers, paginatedUsers, totalPages } = useMemo(() => {
    // Filter users
    const filtered = users.filter(u => {
      const matchesSearch = userSearchQuery === '' || 
        u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.contact?.includes(userSearchQuery);
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });

    // Sort users
    const sorted = [...filtered].sort((a, b) => {
      let compareValue = 0;

      switch (userSortBy) {
        case 'name':
          compareValue = (a.name || '').localeCompare(b.name || '');
          break;
        case 'email':
          compareValue = (a.email || '').localeCompare(b.email || '');
          break;
        case 'role':
          compareValue = (a.role || 'user').localeCompare(b.role || 'user');
          break;
        case 'portfolio':
          const aPort = portfolios.find(p => p.userId === a._id)?.totalValue || 0;
          const bPort = portfolios.find(p => p.userId === b._id)?.totalValue || 0;
          compareValue = bPort - aPort;
          break;
      }

      return userSortOrder === 'asc' ? compareValue : -compareValue;
    });

    // Paginate
    const pages = Math.ceil(sorted.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sorted.slice(startIndex, endIndex);

    return { filteredUsers: filtered, sortedUsers: sorted, paginatedUsers: paginated, totalPages: pages };
  }, [users, userSearchQuery, userRoleFilter, userSortBy, userSortOrder, portfolios, currentPage, itemsPerPage]);


  async function fetchAllData() {
    setLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [usersRes, portfoliosRes, transactionsRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/portfolios', { headers }),
        fetch('/api/admin/transactions', { headers }),
      ]);
      
      const normalizeId = (doc: any) => ({
        ...doc,
        _id: doc?._id?.toString ? doc._id.toString() : doc?._id,
        userId: doc?.userId?.toString ? doc.userId.toString() : doc?.userId,
      });

      if (usersRes.ok) setUsers((await usersRes.json()).map(normalizeId));
      if (portfoliosRes.ok) setPortfolios((await portfoliosRes.json()).map(normalizeId));
      if (transactionsRes.ok) setTransactions((await transactionsRes.json()).map(normalizeId));
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoadingData(false);
    }
  }

  async function saveUser(userData: any) {
    try {
      const token = localStorage.getItem('token');
      const url = userData._id 
        ? `/api/admin/users?id=${userData._id}` 
        : '/api/admin/users';
      const method = userData._id ? 'PUT' : 'POST';
      
      const payload = { ...userData };
      delete payload._id;
      
      console.log('Saving user:', { method, url, payload });
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const result = await res.json();
        console.log('User saved successfully:', result);
        setEditingUser(null);
        fetchAllData();
        alert('User saved successfully');
      } else {
        const err = await res.json();
        console.error('Failed to save user:', err);
        alert(err.message || 'Failed to save user');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save user');
    }
  }

  async function deleteUser(id: string) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchAllData();
        alert('User deleted');
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  }

  async function savePortfolio(portfolioData: any) {
    try {
      const token = localStorage.getItem('token');
      const url = portfolioData._id 
        ? `/api/admin/portfolios?id=${portfolioData._id}` 
        : '/api/admin/portfolios';
      const method = portfolioData._id ? 'PUT' : 'POST';
      
      const payload = { ...portfolioData };
      delete payload._id;
      
      console.log('Saving portfolio:', { method, url, payload });
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const result = await res.json();
        console.log('Portfolio saved successfully:', result);
        setEditingPortfolio(null);
        fetchAllData();
        alert('Portfolio saved successfully');
      } else {
        const err = await res.json();
        console.error('Failed to save portfolio:', err);
        alert(err.message || 'Failed to save portfolio');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save portfolio');
    }
  }

  async function deletePortfolio(id: string) {
    if (!confirm('Delete this portfolio?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/portfolios?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchAllData();
        alert('Portfolio deleted');
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  }

  async function saveTransaction(transactionData: any) {
    try {
      // Business rules: commodities payout schedule & principal lockup
      const normalizedDate = transactionData.date ? new Date(transactionData.date) : new Date();
      const isCommodities = transactionData.investmentType === 'commodities';
      const payoutTypes = ['dividend', 'interest', 'loan_repayment'];

      if (isCommodities && payoutTypes.includes(transactionData.type)) {
        const month = normalizedDate.getUTCMonth(); // 0-based
        const allowedMonths = [0, 4, 8]; // Jan, May, Sep
        if (!allowedMonths.includes(month)) {
          alert('Commodities payouts are only scheduled in January, May, and September.');
          return;
        }
      }

      if (isCommodities && transactionData.type === 'withdrawal') {
        const userId = transactionData.userId;
        const userTxns = transactions.filter((t) => t.userId === userId && t.investmentType === 'commodities');
        const contributionDates = userTxns
          .filter((t) => ['deposit', 'investment', 'loan_given'].includes(t.type))
          .map((t) => (t.date ? new Date(t.date) : null))
          .filter((d) => d && !isNaN(d.getTime())) as Date[];

        if (contributionDates.length > 0) {
          const earliest = contributionDates.reduce((a, b) => (a < b ? a : b));
          const monthsDiff = (normalizedDate.getUTCFullYear() - earliest.getUTCFullYear()) * 12 + (normalizedDate.getUTCMonth() - earliest.getUTCMonth());
          if (monthsDiff < 12) {
            alert('Principal withdrawals for commodities are locked for the first 12 months.');
            return;
          }
        }
      }

      const token = localStorage.getItem('token');
      const url = transactionData._id 
        ? `/api/admin/transactions?id=${transactionData._id}` 
        : '/api/admin/transactions';
      const method = transactionData._id ? 'PUT' : 'POST';
      
      const payload = { ...transactionData };
      delete payload._id;
      
      console.log('Saving transaction:', { method, url, payload });
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const result = await res.json();
        console.log('Transaction saved successfully:', result);
        setEditingTransaction(null);
        fetchAllData();
        alert('Transaction saved successfully');
      } else {
        const err = await res.json();
        console.error('Failed to save transaction:', err);
        alert(err.message || 'Failed to save transaction');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save transaction');
    }
  }

  async function adjustDepositTarget(userId: string, currentTotal: number, targetRaw: string) {
    const cleanTarget = ((targetRaw || '').toString().trim()).replace(/,/g, '');
    const target = cleanTarget === '' ? currentTotal : parseFloat(cleanTarget) || 0;
    const delta = target - currentTotal;

    if (Math.abs(delta) < 1) {
      alert('Target already matches current total. No change needed.');
      return;
    }

    try {
      setAdjustingUserId(userId);
      await saveTransaction({
        userId,
        type: 'deposit',
        amount: delta,
        description: `Admin adjustment: delta UGX ${delta >= 0 ? '+' : ''}${Math.round(delta).toLocaleString()}`,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        investmentType: 'equity',
      });
      setTargetTotals((prev) => ({ ...prev, [userId]: target.toString() }));
    } finally {
      setAdjustingUserId(null);
    }
  }

  async function generatePayout(investor: any, amount: number) {
    if (!amount || amount <= 0) {
      alert('No principal available for payout calculation.');
      return;
    }
    
    if (!investor.payoutStartDate || !investor.payoutEndDate) {
      alert('Please set the payout date range first before generating a payout.');
      return;
    }

    const payoutStartDate = new Date(investor.payoutStartDate).toISOString().split('T')[0];
    const payoutEndDate = new Date(investor.payoutEndDate).toISOString().split('T')[0];
    
    await saveTransaction({
      userId: investor._id,
      type: 'dividend',
      amount,
      description: `Scheduled payout for period ${payoutStartDate} to ${payoutEndDate}`,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      investmentType: 'commodities',
      payoutStartDate: investor.payoutStartDate,
      payoutEndDate: investor.payoutEndDate,
    });
  }

  async function deleteTransaction(id: string) {
    if (!confirm('Delete this transaction?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/transactions?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchAllData();
        alert('Transaction deleted');
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  if (!user || (user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need administrator privileges to access this page.
          </p>
          <div className="space-y-3">
            <a href="/client-portal" className="block w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors">
              Go to Client Portal
            </a>
            <a href="/" className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-sm font-medium transition-colors">
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Admin Portal</h1>
            <div className="text-xs sm:text-sm text-gray-600 truncate max-w-full">
              Logged in as: <span className="font-semibold">{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Tabs */}
        <div className="overflow-x-auto mb-4 sm:mb-6 -mx-3 sm:-mx-4 px-3 sm:px-4 scrollbar-hide">
          <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2.5 px-4 sm:px-6 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-w-[100px] ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 active:bg-gray-300'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('deposits')}
              className={`flex-1 py-2.5 px-4 sm:px-6 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-w-[100px] ${
                activeTab === 'deposits'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 active:bg-gray-300'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setActiveTab('portfolios')}
              className={`flex-1 py-2.5 px-4 sm:px-6 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-w-[100px] ${
                activeTab === 'portfolios'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 active:bg-gray-300'
              }`}
            >
              Portfolios ({portfolios.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-2.5 px-4 sm:px-6 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-w-[100px] ${
                activeTab === 'transactions'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 active:bg-gray-300'
              }`}
            >
              Transactions ({transactions.length})
            </button>
          </div>
        </div>

        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <UsersTab
                users={users}
                portfolios={portfolios}
                transactions={transactions}
                userSearchQuery={userSearchQuery}
                setUserSearchQuery={setUserSearchQuery}
                userRoleFilter={userRoleFilter}
                setUserRoleFilter={setUserRoleFilter}
                userSortBy={userSortBy}
                setUserSortBy={setUserSortBy}
                userSortOrder={userSortOrder}
                setUserSortOrder={setUserSortOrder}
                userViewMode={userViewMode}
                setUserViewMode={setUserViewMode}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                editingUser={editingUser}
                setEditingUser={setEditingUser}
                deleteUser={deleteUser}
                saveUser={saveUser}
                exportUsers={exportUsers}
                formatNumber={formatNumber}
                filteredUsers={filteredUsers}
                sortedUsers={sortedUsers}
                paginatedUsers={paginatedUsers}
                totalPages={totalPages}
                UserForm={UserForm}
              />
            )}


            {/* Deposits Tab */}
            {activeTab === 'deposits' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Investment Deposits & Payouts</h2>
                    <p className="text-sm text-gray-600">Track capital deposits, loans, and dividend/interest payouts for each investor.</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => exportDeposits('pdf')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                      title="Export to PDF"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">PDF</span>
                    </button>
                    <button
                      onClick={() => exportDeposits('excel')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                      title="Export to Excel"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Excel</span>
                    </button>
                  </div>
                </div>

                {/* Search and Sort Controls */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search Investors</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={depositsSearchQuery}
                          onChange={(e) => setDepositsSearchQuery(e.target.value)}
                          placeholder="Search by name or email..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <div className="flex gap-2">
                        <select
                          value={depositsSortBy}
                          onChange={(e) => setDepositsSortBy(e.target.value as any)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="name">Name</option>
                          <option value="deposits">Deposits</option>
                          <option value="withdrawals">Withdrawals</option>
                          <option value="returns">Returns</option>
                          <option value="netInvested">Net Principal</option>
                        </select>
                        <button
                          onClick={() => setDepositsSortOrder(depositsSortOrder === 'asc' ? 'desc' : 'asc')}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          title={depositsSortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {depositsSortOrder === 'asc' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results count */}
                  <div className="mt-4 text-sm text-gray-600">
                    Showing {sortedInvestors.length} of {users.length} investors
                  </div>
                </div>

                {/* Total Admin Fee Summary */}
                {(() => {
                  let totalCommodityPrincipal = 0;
                  users.forEach((investor) => {
                    const userTransactions = transactions.filter((t) => t.userId === investor._id);
                    const commodityTxns = userTransactions.filter((t) => t.investmentType === 'commodities');
                    const commodityContributions = commodityTxns.filter((t) => ['deposit', 'investment', 'loan_given'].includes(t.type));
                    const commodityPayouts = commodityTxns.filter((t) => ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type));
                    const commodityPrincipal = commodityContributions.reduce((sum, t) => sum + (t.amount || 0), 0) - commodityPayouts.reduce((sum, t) => sum + (t.amount || 0), 0);
                    totalCommodityPrincipal += commodityPrincipal;
                  });

                  const totalAdminFee4Months = totalCommodityPrincipal * 0.08;

                  if (totalCommodityPrincipal > 0) {
                    return (
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
                        <h3 className="text-lg sm:text-xl font-bold mb-4">Your Admin Fee Summary (Commodities)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4">
                            <p className="text-purple-100 text-xs sm:text-sm font-medium mb-1">Total Commodities Principal</p>
                            <p className="text-2xl sm:text-3xl font-bold">UGX {formatNumber(totalCommodityPrincipal)}</p>
                            <p className="text-purple-200 text-xs mt-1">Across all investors</p>
                          </div>
                          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4">
                            <p className="text-purple-100 text-xs sm:text-sm font-medium mb-1">Your 4-Month Admin Fee (8%)</p>
                            <p className="text-2xl sm:text-3xl font-bold">UGX {formatNumber(totalAdminFee4Months)}</p>
                            <p className="text-purple-200 text-xs mt-1">2% per month × 4 months</p>
                          </div>
                          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4">
                            <p className="text-purple-100 text-xs sm:text-sm font-medium mb-1">Monthly Average Fee</p>
                            <p className="text-2xl sm:text-3xl font-bold">UGX {formatNumber(totalAdminFee4Months / 4)}</p>
                            <p className="text-purple-200 text-xs mt-1">Collected every 4 months</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {sortedInvestors.map((investor) => {
                  const userTransactions = transactions.filter((t) => t.userId === investor._id);
                  const deposits = userTransactions.filter((t) => ['deposit', 'investment', 'loan_given'].includes(t.type));
                  const withdrawals = userTransactions.filter((t) => t.type === 'withdrawal');
                  const returns = userTransactions.filter((t) => ['dividend', 'interest', 'loan_repayment'].includes(t.type));
                  
                  const totalDeposits = deposits.reduce((sum, t) => sum + (t.amount || 0), 0);
                  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + (t.amount || 0), 0);
                  const totalReturns = returns.reduce((sum, t) => sum + (t.amount || 0), 0);
                  const netInvested = totalDeposits - totalWithdrawals;
                  const commodityTxns = userTransactions.filter((t) => t.investmentType === 'commodities');
                  const commodityContributions = commodityTxns.filter((t) => ['deposit', 'investment', 'loan_given'].includes(t.type));
                  const commodityWithdrawals = commodityTxns.filter((t) => t.type === 'withdrawal');
                  const commodityPrincipal = commodityContributions.reduce((sum, t) => sum + (t.amount || 0), 0) - commodityWithdrawals.reduce((sum, t) => sum + (t.amount || 0), 0);
                  
                  const portfolio = portfolios.find((p) => p.userId === investor._id);

                  return (
                    <div key={investor._id} className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold">{investor.name || investor.email}</h3>
                          <p className="text-sm text-gray-500">{investor.email}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs sm:text-sm text-gray-600">Current Portfolio Value</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">UGX {formatNumber(portfolio?.totalValue || 0)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Deposits</p>
                          <p className="text-xl sm:text-2xl font-bold text-blue-900">UGX {formatNumber(totalDeposits)}</p>
                          <p className="text-xs text-blue-600 mt-1">{deposits.length} transactions</p>
                        </div>
                        <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-red-600 font-medium">Total Withdrawals</p>
                          <p className="text-xl sm:text-2xl font-bold text-red-900">UGX {formatNumber(totalWithdrawals)}</p>
                          <p className="text-xs text-red-600 mt-1">{withdrawals.length} transactions</p>
                        </div>
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-green-600 font-medium">Total Returns</p>
                          <p className="text-xl sm:text-2xl font-bold text-green-900">UGX {formatNumber(totalReturns)}</p>
                          <p className="text-xs text-green-600 mt-1">{returns.length} payouts</p>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-purple-600 font-medium">Net Principal</p>
                          <p className="text-xl sm:text-2xl font-bold text-purple-900">UGX {formatNumber(netInvested)}</p>
                          <p className="text-xs text-purple-600 mt-1">Active investment</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-800 mb-2">Set Total Deposits</p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={targetTotals[investor._id] ?? ''}
                              onChange={(e) => setTargetTotals((prev) => ({ ...prev, [investor._id]: e.target.value }))}
                              className="input-field flex-1"
                                placeholder={`UGX ${formatNumber(totalDeposits)}`}
                            />
                            <button
                              onClick={() => adjustDepositTarget(
                                investor._id,
                                totalDeposits,
                                targetTotals[investor._id] ?? totalDeposits.toString()
                              )}
                              disabled={adjustingUserId === investor._id}
                              className="btn-primary text-sm w-full sm:w-auto"
                            >
                              {adjustingUserId === investor._id ? 'Saving...' : 'Apply'}
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">Creates an adjustment transaction so dashboards stay in sync.</p>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-indigo-800 mb-2">Set Payout Date Range</p>
                          <div className="flex flex-col gap-2">
                            <div>
                              <label className="text-xs text-indigo-600">Start Date</label>
                              <input
                                type="date"
                                value={investor.payoutStartDate ? new Date(investor.payoutStartDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                  const updatedUser = { ...investor, payoutStartDate: e.target.value };
                                  saveUser(updatedUser);
                                }}
                                className="input-field text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-indigo-600">End Date</label>
                              <input
                                type="date"
                                value={investor.payoutEndDate ? new Date(investor.payoutEndDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                  const updatedUser = { ...investor, payoutEndDate: e.target.value };
                                  saveUser(updatedUser);
                                }}
                                className="input-field text-sm"
                              />
                            </div>
                          </div>
                          <p className="text-xs text-indigo-600 mt-2">
                            {investor.payoutStartDate && investor.payoutEndDate 
                              ? `Payout period: ${new Date(investor.payoutStartDate).toLocaleDateString()} - ${new Date(investor.payoutEndDate).toLocaleDateString()}`
                              : 'Set the payout period for this investor'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setEditingTransaction({
                              userId: investor._id,
                              type: 'deposit',
                              amount: 0,
                              description: 'Principal deposit - Capital contribution',
                              status: 'completed',
                              date: new Date().toISOString().split('T')[0],
                              investmentType: 'equity'
                            });
                            setActiveTab('transactions');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          💰 Principal Deposit
                        </button>
                        <button
                          onClick={() => {
                            setEditingTransaction({
                              userId: investor._id,
                              type: 'dividend',
                              amount: 0,
                              description: 'ROI payout - Dividend/Interest',
                              status: 'completed',
                              date: new Date().toISOString().split('T')[0],
                              investmentType: 'equity'
                            });
                            setActiveTab('transactions');
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          📈 ROI Payout
                        </button>
                        <button
                          onClick={() => {
                            setEditingTransaction({
                              userId: investor._id,
                              type: 'withdrawal',
                              amount: 0,
                              description: 'Principal payout - Withdrawal',
                              status: 'completed',
                              date: new Date().toISOString().split('T')[0],
                              investmentType: 'equity'
                            });
                            setActiveTab('transactions');
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          💸 Principal Payout
                        </button>
                        <button
                          onClick={() => {
                            setEditingTransaction({
                              userId: investor._id,
                              type: 'loan_given',
                              amount: 0,
                              description: 'Loan to company',
                              status: 'completed',
                              date: new Date().toISOString().split('T')[0],
                              investmentType: 'loan'
                            });
                            setActiveTab('transactions');
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          🤝 Record Loan
                        </button>
                      </div>

                      {/* Investment Type Breakdown */}
                      {(() => {
                        if (commodityPrincipal > 0) {
                          return (
                            <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-amber-900">Commodities Investment (Coffee & Cocoa)</h4>
                                <button
                                  onClick={() => {
                                    setEditingTransaction({
                                      userId: investor._id,
                                      type: 'deposit',
                                      amount: 0,
                                      description: 'Additional commodities deposit',
                                      status: 'completed',
                                      date: new Date().toISOString().split('T')[0],
                                      investmentType: 'commodities'
                                    });
                                    setActiveTab('transactions');
                                  }}
                                  className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded"
                                >
                                  + Add More Capital
                                </button>
                              </div>
                              <div className="grid grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-amber-600 font-medium">Current Principal</p>
                                  <p className="text-xl font-bold text-amber-900">UGX {formatNumber(commodityPrincipal)}</p>
                                </div>
                                <div>
                                  <p className="text-amber-600 font-medium">4-Month Payout (32%)</p>
                                  <p className="text-xl font-bold text-amber-900">UGX {formatNumber(commodityPrincipal * 0.32)}</p>
                                </div>
                                <div>
                                  <p className="text-amber-600 font-medium">Total Return (40%)</p>
                                  <p className="text-xl font-bold text-amber-900">UGX {formatNumber(commodityPrincipal * 0.40)}</p>
                                </div>
                                <div>
                                  <p className="text-amber-600 font-medium">Your Admin Fee (8%)</p>
                                  <p className="text-xl font-bold text-amber-900">UGX {formatNumber(commodityPrincipal * 0.08)}</p>
                                </div>
                              </div>
                              <p className="text-xs text-amber-700 mt-2">Next payout calculation based on current principal</p>

                              <div className="mt-4 bg-white/70 border border-amber-200 rounded p-3">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-amber-900">Generate Payout Transaction</p>
                                    {investor.payoutStartDate && investor.payoutEndDate ? (
                                      <p className="text-xs text-amber-700 mt-1">
                                        Payout period: {new Date(investor.payoutStartDate).toLocaleDateString()} - {new Date(investor.payoutEndDate).toLocaleDateString()}
                                      </p>
                                    ) : (
                                      <p className="text-xs text-red-600 mt-1">⚠️ Please set payout date range above first</p>
                                    )}
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-amber-700 mb-1">Payout Amount (32%)</p>
                                    <p className="font-bold text-amber-900 text-lg">UGX {formatNumber(commodityPrincipal * 0.32)}</p>
                                  </div>
                                  <div>
                                    <button
                                      onClick={() => generatePayout(investor, commodityPrincipal * 0.32)}
                                      disabled={!investor.payoutStartDate || !investor.payoutEndDate}
                                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                        investor.payoutStartDate && investor.payoutEndDate
                                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                      }`}
                                    >
                                      Create Payout
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {userTransactions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Recent Transactions</h4>
                          <div className="space-y-1">
                            {userTransactions.slice(0, 5).map((t) => (
                              <div key={t._id} className="flex justify-between items-center text-sm py-1 border-b">
                                <span className="text-gray-600">{t.date} - {t.type}</span>
                                <span className={`font-medium ${['deposit', 'investment', 'loan_given'].includes(t.type) ? 'text-blue-600' : 'text-green-600'}`}>
                                  UGX {formatNumber(t.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Portfolios Tab */}
            {activeTab === 'portfolios' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Manage Portfolios</h2>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportPortfolios('pdf')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                        title="Export to PDF"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                      <button
                        onClick={() => exportPortfolios('excel')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                        title="Export to Excel"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden sm:inline">Excel</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setEditingPortfolio({ userId: '', totalValue: 0, totalGain: 0, totalGainPercent: 0, holdings: [] })}
                      className="btn-primary text-sm"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {editingPortfolio && (
                  <PortfolioForm
                    portfolio={editingPortfolio}
                    users={users}
                    onChange={setEditingPortfolio}
                    onSave={() => savePortfolio(editingPortfolio)}
                    onCancel={() => setEditingPortfolio(null)}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolios.map((p) => {
                    const owner = users.find((u) => u._id === p.userId);
                    return (
                      <div key={p._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{owner?.name || owner?.email || 'Unknown User'}</h3>
                            <p className="text-sm text-gray-600">Total Value: UGX {p.totalValue?.toLocaleString() || 0}</p>
                            <p className="text-sm text-gray-600">Holdings: {p.holdings?.length || 0}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => setEditingPortfolio(p)} className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                            <button onClick={() => deletePortfolio(p._id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Manage Transactions</h2>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportTransactions('pdf')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                        title="Export to PDF"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                      <button
                        onClick={() => exportTransactions('excel')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                        title="Export to Excel"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden sm:inline">Excel</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setEditingTransaction({ userId: '', type: 'deposit', amount: 0, description: '', status: 'pending', date: new Date().toISOString().split('T')[0] })}
                      className="btn-primary text-sm"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {editingTransaction && (
                  <TransactionForm
                    transaction={editingTransaction}
                    users={users}
                    onChange={setEditingTransaction}
                    onSave={() => saveTransaction(editingTransaction)}
                    onCancel={() => setEditingTransaction(null)}
                  />
                )}

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((t) => {
                        const owner = users.find((u) => u._id === t.userId);
                        return (
                          <tr key={t._id}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{t.date || 'N/A'}</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{owner?.email || 'N/A'}</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{t.type}</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">UGX {formatNumber(t.amount)}</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                t.status === 'completed' ? 'bg-green-100 text-green-800' :
                                t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm space-x-2">
                              <button onClick={() => {
                                // Format dates for date inputs
                                const formatDate = (date: any) => {
                                  if (!date) return '';
                                  const d = new Date(date);
                                  return d.toISOString().split('T')[0];
                                };
                                
                                setEditingTransaction({
                                  ...t,
                                  date: formatDate(t.date),
                                  investmentStartDate: formatDate(t.investmentStartDate),
                                  payoutStartDate: formatDate(t.payoutStartDate),
                                  payoutEndDate: formatDate(t.payoutEndDate),
                                  maturityDate: formatDate(t.maturityDate)
                                });
                              }} className="text-blue-600 hover:text-blue-900">Edit</button>
                              <button onClick={() => deleteTransaction(t._id)} className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UserForm({ user, onChange, onSave, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{user._id ? 'Edit User' : 'Create User'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => onChange({ ...user, email: e.target.value })}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={user.name || ''}
            onChange={(e) => onChange({ ...user, name: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password {user._id && '(leave blank to keep current)'}</label>
          <input
            type="password"
            value={user.password || ''}
            onChange={(e) => onChange({ ...user, password: e.target.value })}
            className="input-field"
            placeholder={user._id ? 'Leave blank to keep current' : 'Required'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={user.role || 'user'}
            onChange={(e) => onChange({ ...user, role: e.target.value })}
            className="input-field"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
          <input
            type="text"
            value={user.accountType || ''}
            onChange={(e) => onChange({ ...user, accountType: e.target.value })}
            className="input-field"
            placeholder="e.g., Individual, Corporate"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
          <select
            value={user.riskTolerance || 'moderate'}
            onChange={(e) => onChange({ ...user, riskTolerance: e.target.value })}
            className="input-field"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3 mt-6">
        <button onClick={onSave} className="btn-primary">Save</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
      </div>
    </div>
  );
}

function PortfolioForm({ portfolio, users, onChange, onSave, onCancel }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">{portfolio._id ? 'Edit Portfolio' : 'Create Portfolio'}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
          <select
            value={portfolio.userId || ''}
            onChange={(e) => onChange({ ...portfolio, userId: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Select User</option>
            {users.map((u: any) => (
              <option key={u._id} value={u._id}>{u.email} - {u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Value (UGX)</label>
          <input
            type="number"
            value={portfolio.totalValue || 0}
            onChange={(e) => onChange({ ...portfolio, totalValue: parseFloat(e.target.value) || 0 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Gain (UGX)</label>
          <input
            type="number"
            value={portfolio.totalGain || 0}
            onChange={(e) => onChange({ ...portfolio, totalGain: parseFloat(e.target.value) || 0 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Gain %</label>
          <input
            type="number"
            step="0.01"
            value={portfolio.totalGainPercent || 0}
            onChange={(e) => onChange({ ...portfolio, totalGainPercent: parseFloat(e.target.value) || 0 })}
            className="input-field"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Holdings (JSON)</label>
        <textarea
          value={JSON.stringify(portfolio.holdings || [], null, 2)}
          onChange={(e) => {
            try {
              onChange({ ...portfolio, holdings: JSON.parse(e.target.value) });
            } catch (err) {
              // Invalid JSON, ignore
            }
          }}
          className="input-field font-mono text-sm"
          rows={6}
          placeholder='[{"name": "Stock A", "type": "equity", "value": 1000000, "allocation": 50, "change": 5.2}]'
        />
      </div>
      <div className="flex space-x-3 mt-6">
        <button onClick={onSave} className="btn-primary">Save</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}

function TransactionForm({ transaction, users, onChange, onSave, onCancel }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">{transaction._id ? 'Edit Transaction' : 'Create Transaction'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
          <select
            value={transaction.userId || ''}
            onChange={(e) => onChange({ ...transaction, userId: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Select User</option>
            {users.map((u: any) => (
              <option key={u._id} value={u._id}>{u.email} - {u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
          <select
            value={transaction.type || 'deposit'}
            onChange={(e) => onChange({ ...transaction, type: e.target.value })}
            className="input-field"
          >
            <optgroup label="Contributions">
              <option value="deposit">Deposit / Capital Contribution</option>
              <option value="investment">Investment Purchase</option>
              <option value="loan_given">Loan Given to Company</option>
            </optgroup>
            <optgroup label="Returns & Payouts">
              <option value="dividend">Dividend Payout</option>
              <option value="interest">Interest Payment</option>
              <option value="loan_repayment">Loan Repayment</option>
              <option value="withdrawal">Withdrawal / Cash Out</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Investment Type</label>
          <select
            value={transaction.investmentType || 'equity'}
            onChange={(e) => onChange({ ...transaction, investmentType: e.target.value })}
            className="input-field"
          >
            <option value="equity">Equity / Shares</option>
            <option value="bonds">Bonds</option>
            <option value="loan">Loan</option>
            <option value="mutual_fund">Mutual Fund</option>
            <option value="real_estate">Real Estate</option>
            <option value="fixed_deposit">Fixed Deposit</option>
            <option value="commodities">Commodities (Coffee & Cocoa)</option>
            <option value="other">Other</option>
          </select>
        </div>
        {transaction.investmentType === 'commodities' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commodity Company</label>
            <select
              value={transaction.commodityCompany || ''}
              onChange={(e) => onChange({ ...transaction, commodityCompany: e.target.value })}
              className="input-field"
            >
              <option value="">Select Company</option>
              <option value="dregif">Dregif Coffee Ltd (Coffee & Cocoa)</option>
              <option value="stanfield">Stanfield Commodities Exchange (Coffee)</option>
              <option value="both">Both Companies</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (UGX)</label>
          <input
            type="text"
            value={transaction.amount ? transaction.amount.toLocaleString() : ''}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, '');
              onChange({ ...transaction, amount: parseFloat(rawValue) || 0 });
            }}
            className="input-field"
            placeholder="Enter amount"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Date</label>
          <input
            type="date"
            value={transaction.date || ''}
            onChange={(e) => onChange({ ...transaction, date: e.target.value })}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Investment Start Date</label>
          <input
            type="date"
            value={transaction.investmentStartDate || ''}
            onChange={(e) => onChange({ ...transaction, investmentStartDate: e.target.value })}
            className="input-field"
            placeholder="When investment started"
          />
          <p className="text-xs text-gray-500 mt-1">Optional: Actual date when investment began</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={transaction.status || 'pending'}
            onChange={(e) => onChange({ ...transaction, status: e.target.value })}
            className="input-field"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description / Notes</label>
          <textarea
            value={transaction.description || ''}
            onChange={(e) => onChange({ ...transaction, description: e.target.value })}
            className="input-field"
            rows={2}
            placeholder="Add details about this transaction (e.g., investment details, terms, etc.)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Return Rate (%) - Optional</label>
          <input
            type="number"
            step="0.01"
            value={transaction.returnRate || ''}
            onChange={(e) => onChange({ ...transaction, returnRate: parseFloat(e.target.value) || 0 })}
            className="input-field"
            placeholder={transaction.investmentType === 'commodities' ? '10% (auto-calculated for commodities)' : 'e.g., 8.5 for 8.5% annual return'}
            disabled={transaction.investmentType === 'commodities'}
          />
          {transaction.investmentType === 'commodities' && (
            <p className="text-xs text-gray-600 mt-1">
              Commodities: 10% monthly return (8% to investor, 2% admin fee) - Payouts every 4 months
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maturity Date - Optional</label>
          <input
            type="date"
            value={transaction.maturityDate || ''}
            onChange={(e) => onChange({ ...transaction, maturityDate: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payout Start Date</label>
          <input
            type="date"
            value={transaction.payoutStartDate || ''}
            onChange={(e) => onChange({ ...transaction, payoutStartDate: e.target.value })}
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">Optional: Start of payout period</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payout End Date</label>
          <input
            type="date"
            value={transaction.payoutEndDate || ''}
            onChange={(e) => onChange({ ...transaction, payoutEndDate: e.target.value })}
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">Optional: End of payout period</p>
        </div>
        {transaction.investmentType === 'commodities' && transaction.amount > 0 && (
          <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📅 Investment Timeline Guide</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-blue-700 font-medium">Investment Start Date</p>
                <p className="text-xs text-blue-600">When the investor's money was first deposited</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Payout Period</p>
                <p className="text-xs text-blue-600">Start and end dates for scheduled payout calculation</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Transaction Date</p>
                <p className="text-xs text-blue-600">When this specific transaction occurred</p>
              </div>
            </div>
          </div>
        )}
        {transaction.investmentType === 'commodities' && transaction.amount > 0 && (
          <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">4-Month Payout Calculation (Paid Quarterly)</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-600">Principal Amount</p>
                <p className="font-bold text-blue-900">UGX {(transaction.amount || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-600">Total 4-Month Return (40%)</p>
                <p className="font-bold text-blue-900">UGX {((transaction.amount || 0) * 0.40).toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">10% × 4 months</p>
              </div>
              <div>
                <p className="text-green-600">Investor Receives (32%)</p>
                <p className="font-bold text-green-900">UGX {((transaction.amount || 0) * 0.32).toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">8% × 4 months</p>
              </div>
              <div>
                <p className="text-purple-600">Admin Fee (8%)</p>
                <p className="font-bold text-purple-900">UGX {((transaction.amount || 0) * 0.08).toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">2% × 4 months</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-3 mt-6">
        <button onClick={onSave} className="btn-primary">Save</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}
