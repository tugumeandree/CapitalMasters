'use client';

import React from 'react';
import UserCard from './UserCard';
import UserTableRow from './UserTableRow';

interface UsersTabProps {
  users: any[];
  portfolios: any[];
  transactions: any[];
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  userRoleFilter: 'all' | 'admin' | 'user';
  setUserRoleFilter: (filter: 'all' | 'admin' | 'user') => void;
  userSortBy: 'name' | 'email' | 'role' | 'portfolio' | 'date' | 'transactions';
  setUserSortBy: (sort: 'name' | 'email' | 'role' | 'portfolio' | 'date' | 'transactions') => void;
  userSortOrder: 'asc' | 'desc';
  setUserSortOrder: (order: 'asc' | 'desc') => void;
  userViewMode: 'cards' | 'table';
  setUserViewMode: (mode: 'cards' | 'table') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  editingUser: any;
  setEditingUser: (user: any) => void;
  deleteUser: (id: string) => void;
  saveUser: (user: any) => void;
  exportUsers: (format: 'pdf' | 'excel') => void;
  formatNumber: (num: number) => string;
  filteredUsers: any[];
  sortedUsers: any[];
  paginatedUsers: any[];
  totalPages: number;
  UserForm: React.ComponentType<any>;
}

export default function UsersTab({
  users,
  portfolios,
  transactions,
  userSearchQuery,
  setUserSearchQuery,
  userRoleFilter,
  setUserRoleFilter,
  userSortBy,
  setUserSortBy,
  userSortOrder,
  setUserSortOrder,
  userViewMode,
  setUserViewMode,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  editingUser,
  setEditingUser,
  deleteUser,
  saveUser,
  exportUsers,
  formatNumber,
  filteredUsers,
  sortedUsers,
  paginatedUsers,
  totalPages,
  UserForm,
}: UsersTabProps) {
  // Calculate total expected payout for all investors
  const totalExpectedPayout = users
    .filter(u => u.role !== 'admin')
    .reduce((total, user) => {
      const userTransactions = transactions.filter(t => t.userId === user._id);
      const contributions = userTransactions.filter(t => 
        ['deposit', 'investment', 'loan_given'].includes(t.type)
      );
      const payouts = userTransactions.filter(t => 
        ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
      );
      const totalContribs = contributions.reduce((sum, t) => sum + t.amount, 0);
      const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
      const netInvested = totalContribs - totalPayouts;
      const payout = netInvested * 0.32;
      return total + payout;
    }, 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
          <p className="text-gray-600 mt-1">View and manage all registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportUsers('pdf')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              title="Export to PDF"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={() => exportUsers('excel')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              title="Export to Excel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
          <button
            onClick={() => setEditingUser({ email: '', name: '', role: 'user', password: '' })}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Total Expected Payout Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold mb-1">Total Expected Payout to All Investors</h3>
            <p className="text-green-100 text-sm">32% returns on all active portfolios</p>
          </div>
          <div className="text-right">
            <p className="text-white text-4xl font-bold">UGX {formatNumber(totalExpectedPayout)}</p>
            <p className="text-green-100 text-sm mt-1">{users.filter(u => u.role !== 'admin').length} investors</p>
          </div>
        </div>
      </div>

      {/* Search, Filter, and View Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or contact..."
                value={userSearchQuery}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
              {userSearchQuery && (
                <button
                  onClick={() => setUserSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={userRoleFilter}
              onChange={(e) => {
                setUserRoleFilter(e.target.value as 'all' | 'admin' | 'user');
                setCurrentPage(1);
              }}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="all">All Roles</option>
              <option value="admin">👑 Admin Only</option>
              <option value="user">👤 Users Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={userSortBy}
              onChange={(e) => {
                setUserSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="email">Sort: Email (A-Z)</option>
              <option value="role">Sort: Role</option>
              <option value="portfolio">Sort: Portfolio Value</option>
              <option value="date">Sort: Join Date</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle and Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of <span className="font-semibold text-gray-900">{users.length}</span> users
            </span>
          </div>

          {/* View Toggle and Sort Order */}
          <div className="flex items-center space-x-2">
            {/* Sort Order Toggle */}
            <button
              onClick={() => setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center space-x-2"
              title={userSortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {userSortOrder === 'asc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                )}
              </svg>
              <span className="text-sm text-gray-600">{userSortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUserViewMode('cards')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  userViewMode === 'cards'
                    ? 'bg-white text-purple-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setUserViewMode('table')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  userViewMode === 'table'
                    ? 'bg-white text-purple-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingUser && (
        <UserForm
          user={editingUser}
          onChange={setEditingUser}
          onSave={() => saveUser(editingUser)}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {userViewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedUsers.map((u) => (
            <UserCard
              key={u._id}
              user={u}
              portfolios={portfolios}
              transactions={transactions}
              onEdit={setEditingUser}
              onDelete={deleteUser}
              formatNumber={formatNumber}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Portfolio</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payout (32%)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((u) => (
                  <UserTableRow
                    key={u._id}
                    user={u}
                    portfolios={portfolios}
                    transactions={transactions}
                    onEdit={setEditingUser}
                    onDelete={deleteUser}
                    formatNumber={formatNumber}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-lg px-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            >
              <option value="6">6</option>
              <option value="9">9</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No users found matching your criteria</p>
          <button
            onClick={() => {
              setUserSearchQuery('');
              setUserRoleFilter('all');
            }}
            className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
