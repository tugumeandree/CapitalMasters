interface UserTableRowProps {
  user: any;
  portfolios: any[];
  transactions: any[];
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
  formatNumber: (value: number) => string;
}

export default function UserTableRow({ user, portfolios, transactions, onEdit, onDelete, formatNumber }: UserTableRowProps) {
  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };
  
  const userPortfolio = portfolios.find(p => p.userId === user._id);
  const userTransactions = transactions.filter(t => t.userId === user._id);
  
  const oldestTxn = userTransactions.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];
  const investmentDate = oldestTxn ? new Date(oldestTxn.date) : new Date();
  const isEligibleFor2026Jan = investmentDate.getFullYear() === 2025 || investmentDate.getFullYear() < 2025;
  const isRonald = user.email === 'ronaldopa323@gmail.com';
  
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
  const payoutMonth = isRonald ? 'May 2026' : (isEligibleFor2026Jan ? 'Jan 2026' : 'May 2026');

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-lg ${user.role === 'admin' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'} flex items-center justify-center text-white text-sm font-bold`}>
            {getInitials(user.name, user.email)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">{user.name || 'No Name'}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.contact || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {user.role === 'admin' ? '👑 Admin' : '👤 User'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          {user.role !== 'admin' ? `UGX ${formatNumber(netInvested)}` : 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {user.role !== 'admin' ? (
          <div>
            <div className="text-sm font-semibold text-green-600">UGX {formatNumber(payout)}</div>
            <div className="text-xs text-gray-500">{payoutMonth}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">N/A</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
        <button 
          onClick={() => onEdit(user)} 
          className="text-blue-600 hover:text-blue-900 font-medium"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(user._id)} 
          className="text-red-600 hover:text-red-900 font-medium"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
