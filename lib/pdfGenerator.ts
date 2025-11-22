import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PortfolioData {
  userName: string;
  accountType: string;
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
}

interface Transaction {
  description: string;
  type: string;
  amount: number;
  date: string;
  status: string;
}

export function generatePortfolioStatement(
  portfolio: PortfolioData,
  transactions: Transaction[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175); // primary-700
  doc.text('CapitalMasters', 14, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Portfolio Statement', 14, 30);
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38);
  
  // Client Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Client: ${portfolio.userName}`, 14, 50);
  doc.text(`Account Type: ${portfolio.accountType}`, 14, 57);
  
  // Portfolio Summary Box
  doc.setFillColor(240, 249, 255); // bg-blue-50
  doc.rect(14, 65, pageWidth - 28, 30, 'F');
  
  doc.setFontSize(11);
  doc.text('Portfolio Summary', 18, 72);
  
  doc.setFontSize(10);
  doc.text(`Total Value: $${portfolio.totalValue.toLocaleString()}`, 18, 80);
  doc.text(`Total Gain: $${portfolio.totalGain.toLocaleString()}`, 18, 86);
  doc.text(`Return: +${portfolio.totalGainPercent}%`, 18, 92);
  
  // Holdings Table
  doc.setFontSize(12);
  doc.text('Holdings', 14, 108);
  
  autoTable(doc, {
    startY: 112,
    head: [['Asset', 'Type', 'Value', 'Allocation', 'Change']],
    body: portfolio.holdings.map(h => [
      h.name,
      h.type,
      `$${h.value.toLocaleString()}`,
      `${h.allocation}%`,
      `${h.change > 0 ? '+' : ''}${h.change}%`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175] },
  });
  
  // Transactions Table
  const finalY = (doc as any).lastAutoTable.finalY || 112;
  doc.setFontSize(12);
  doc.text('Recent Transactions', 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Date', 'Description', 'Type', 'Amount']],
    body: transactions.slice(0, 10).map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.type,
      `${t.amount > 0 ? '+' : ''}$${Math.abs(t.amount).toLocaleString()}`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175] },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'CapitalMasters Investment Company | Confidential',
      pageWidth / 2,
      doc.internal.pageSize.height - 5,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`CapitalMasters_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function generateTransactionReport(transactions: Transaction[], userName: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text('CapitalMasters', 14, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Transaction Report', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38);
  doc.text(`Client: ${userName}`, 14, 44);
  
  // Transactions Table
  autoTable(doc, {
    startY: 55,
    head: [['Date', 'Description', 'Type', 'Amount', 'Status']],
    body: transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.type,
      `${t.amount > 0 ? '+' : ''}$${Math.abs(t.amount).toLocaleString()}`,
      t.status
    ]),
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175] },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`CapitalMasters_Transactions_${new Date().toISOString().split('T')[0]}.pdf`);
}
