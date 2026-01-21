interface UserCardProps {
  user: any;
  portfolios: any[];
  transactions: any[];
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
  formatNumber: (value: number) => string;
}

export default function UserCard({ user, portfolios, transactions, onEdit, onDelete, formatNumber }: UserCardProps) {
  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };
  
  const userTransactions = transactions.filter(t => t.userId === user._id);
  const userPortfolio = portfolios.find(p => p.userId === user._id);
  const contributions = userTransactions.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type));
  const totalContributions = contributions.reduce((sum, t) => sum + (t.amount || 0), 0);

  const oldestTxn = userTransactions.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];
  const investmentDate = oldestTxn ? new Date(oldestTxn.date) : new Date();
  const isEligibleFor2026Jan = investmentDate.getFullYear() === 2025 || investmentDate.getFullYear() < 2025;
  const isRonald = user.email === 'ronaldopa323@gmail.com';
  
  const payouts = userTransactions.filter(t => 
    ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type)
  );
  const totalContribs = contributions.reduce((sum, t) => sum + t.amount, 0);
  const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);
  const netInvested = totalContribs - totalPayouts;
  const expectedPayout = netInvested * 0.32;
  const payoutMonth = isRonald ? 'May 2026' : (isEligibleFor2026Jan ? 'Jan 2026' : 'May 2026');

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className={`h-24 bg-gradient-to-br ${user.role === 'admin' ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'} relative`}>
        <div className="absolute -bottom-12 left-6">
          <div className={`w-24 h-24 rounded-2xl ${user.role === 'admin' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'} shadow-xl flex items-center justify-center text-white text-2xl font-bold border-4 border-white`}>
            {getInitials(user.name, user.email)}
          </div>
        </div>
      </div>
      
      <div className="pt-16 px-6 pb-6">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{user.name || 'No Name'}</h3>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200' : 'bg-blue-100 text-blue-700 ring-2 ring-blue-200'}`}>
              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
            </span>
          </div>
          <p className="text-sm text-gray-600 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{user.email}</span>
          </p>
          {user.contact && (
            <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{user.contact}</span>
            </p>
          )}
        </div>
        
        {user.role !== 'admin' && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Portfolio Value</span>
              <span className="text-sm font-bold text-gray-900">UGX {formatNumber(userPortfolio?.totalValue || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Contributions</span>
              <span className="text-sm font-bold text-blue-600">UGX {formatNumber(totalContributions)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
              <span className="text-xs font-medium text-gray-600">Expected Payout ({payoutMonth})</span>
              <span className="text-sm font-bold text-green-600">UGX {formatNumber(expectedPayout)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Transactions</span>
              <span className="text-sm font-bold text-gray-900">{userTransactions.length}</span>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(user)} 
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
          <button 
            onClick={() => onDelete(user._id)} 
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
