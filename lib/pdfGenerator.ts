import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrimaryAndSecondary } from './currency';

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
  const pageHeight = doc.internal.pageSize.height;
  
  // Professional Header with Logo Area
  doc.setFillColor(30, 64, 175); // primary-700
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('CAPITALMASTERS', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Investment Management & Advisory', pageWidth / 2, 22, { align: 'center' });
  doc.text('Kampala, Uganda | info@capitalmasters.ug', pageWidth / 2, 28, { align: 'center' });
  
  // Document Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('PORTFOLIO STATEMENT', 14, 48);
  
  // Statement Period & Generation Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const today = new Date();
  doc.text(`Statement Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 55);
  doc.text(`Period: September 2025 - December 2025`, 14, 60);
  
  // Client Information Box
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(14, 68, pageWidth - 28, 22, 2, 2, 'FD');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Client Information', 18, 75);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Name: ${portfolio.userName}`, 18, 81);
  doc.text(`Account Type: ${portfolio.accountType}`, 18, 86);
  doc.text(`Account Status: Active`, pageWidth - 80, 81);
  doc.text(`Statement #: ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, pageWidth - 80, 86);
  
  // Portfolio Performance Box - Enhanced
  doc.setFillColor(240, 253, 244); // green-50
  doc.setDrawColor(34, 197, 94); // green-500
  doc.roundedRect(14, 98, pageWidth - 28, 45, 2, 2, 'FD');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52); // green-800
  doc.text('Portfolio Summary', 18, 106);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Investment Performance Overview', 18, 112);
  
  const totalVals = formatPrimaryAndSecondary(portfolio.totalValue);
  const gainVals = formatPrimaryAndSecondary(portfolio.totalGain);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Total Portfolio Value:', 18, 122);
  doc.setFont('helvetica', 'normal');
  doc.text(`${totalVals.primary}`, 70, 122);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`(${totalVals.secondary})`, 70, 127);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Total Returns:', 18, 135);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 163, 74); // green-600
  doc.text(`+${gainVals.primary}`, 70, 135);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`(${gainVals.secondary})`, 70, 140);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74);
  doc.text(`+${portfolio.totalGainPercent}%`, pageWidth - 50, 128);
  
  // Asset Allocation Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Investment Breakdown', 14, 155);
  
  autoTable(doc, {
    startY: 160,
    head: [['Asset Name', 'Asset Type', 'Current Value', 'Allocation', 'Performance']],
    body: portfolio.holdings.map(h => {
      const vals = formatPrimaryAndSecondary(h.value);
      return [
        h.name,
        h.type.charAt(0).toUpperCase() + h.type.slice(1),
        `${vals.primary}\n(${vals.secondary})`,
        `${h.allocation}%`,
        `${h.change > 0 ? '+' : ''}${h.change}%`
      ];
    }),
    theme: 'grid',
    headStyles: { 
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 50, halign: 'right' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center', textColor: [22, 163, 74] }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });
  
  // Key Investment Details
  const finalY = (doc as any).lastAutoTable.finalY || 160;
  
  doc.setFillColor(254, 252, 232); // yellow-50
  doc.setDrawColor(250, 204, 21); // yellow-400
  doc.roundedRect(14, finalY + 10, pageWidth - 28, 28, 2, 2, 'FD');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(133, 77, 14); // yellow-900
  doc.text('Important Investment Details', 18, finalY + 18);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('• Investment Cycle: 4 months (September - December 2025)', 18, finalY + 24);
  doc.text('• Monthly Gross Returns: 10% | Net Returns: 8% (after 2% management fee)', 18, finalY + 29);
  doc.text('• Total Cycle Returns: 32% | Payout Schedule: January 23-30, 2026', 18, finalY + 34);
  
  // Transactions Table
  const transY = (doc as any).lastAutoTable.finalY + 48 || 200;
  
  // Check if we need a new page
  if (transY > pageHeight - 80) {
    doc.addPage();
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CAPITALMASTERS', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Investment Management & Advisory', pageWidth / 2, 22, { align: 'center' });
  }
  
  const tableStartY = transY > pageHeight - 80 ? 50 : transY;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Transaction History', 14, tableStartY - 5);
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['Date', 'Description', 'Type', 'Amount', 'Status']],
    body: transactions.slice(0, 15).map(t => {
      const amt = Math.abs(t.amount);
      const vals = formatPrimaryAndSecondary(amt);
      const sign = t.type.toLowerCase() === 'deposit' ? '+' : '-';
      return [
        new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        t.description,
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        `${sign}${vals.primary}\n(${vals.secondary})`,
        t.status.charAt(0).toUpperCase() + t.status.slice(1)
      ];
    }),
    theme: 'grid',
    headStyles: { 
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },
      1: { cellWidth: 60 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 45, halign: 'right', fontStyle: 'bold' },
      4: { cellWidth: 25, halign: 'center' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });
  
  // Disclaimer and Footer Information
  const disclaimerY = (doc as any).lastAutoTable.finalY + 10 || pageHeight - 60;
  
  if (disclaimerY < pageHeight - 50) {
    doc.setFillColor(250, 250, 250);
    doc.rect(14, disclaimerY, pageWidth - 28, 35, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Important Disclaimer', 18, disclaimerY + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    const disclaimerText = 'This statement is provided for informational purposes only. All investments carry risk. Past performance does not guarantee future results. CapitalMasters is a licensed investment advisory firm regulated by the Uganda Securities Exchange. Please consult with your financial advisor before making investment decisions.';
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 36);
    doc.text(splitDisclaimer, 18, disclaimerY + 12);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Contact Information:', 18, disclaimerY + 28);
    doc.setFont('helvetica', 'normal');
    doc.text('Email: support@capitalmasters.ug | Phone: +256 700 000 000 | Website: www.capitalmasters.ug', 18, disclaimerY + 32);
  }
  
  // Professional Footer on all pages
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
    
    // Page number
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${pageCount}`,
      14,
      pageHeight - 8
    );
    
    // Confidentiality notice
    doc.text(
      'CapitalMasters Investment Company | Confidential Document',
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    
    // Generation timestamp
    doc.text(
      `Generated: ${new Date().toLocaleString('en-US')}`,
      pageWidth - 14,
      pageHeight - 8,
      { align: 'right' }
    );
  }
  
  // Save with enhanced filename
  const fileName = `CapitalMasters_Portfolio_Statement_${portfolio.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export function generateTransactionReport(transactions: Transaction[], userName: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Professional Header
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('CAPITALMASTERS', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Investment Management & Advisory', pageWidth / 2, 22, { align: 'center' });
  doc.text('Kampala, Uganda | info@capitalmasters.ug', pageWidth / 2, 28, { align: 'center' });
  
  // Document Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('TRANSACTION REPORT', 14, 48);
  
  // Report Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Report Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 55);
  doc.text(`Client: ${userName}`, 14, 60);
  doc.text(`Total Transactions: ${transactions.length}`, 14, 65);
  
  // Summary Box
  const deposits = transactions.filter(t => t.type.toLowerCase() === 'deposit');
  const withdrawals = transactions.filter(t => t.type.toLowerCase() === 'withdrawal');
  const totalDeposits = deposits.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(14, 73, (pageWidth - 28) / 2 - 2, 20, 2, 2, 'FD');
  
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(239, 68, 68);
  doc.roundedRect((pageWidth - 28) / 2 + 16, 73, (pageWidth - 28) / 2 - 2, 20, 2, 2, 'FD');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('Total Deposits', 18, 80);
  doc.setFontSize(11);
  const depositVals = formatPrimaryAndSecondary(totalDeposits);
  doc.text(depositVals.primary, 18, 88);
  
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(9);
  doc.text('Total Withdrawals', (pageWidth - 28) / 2 + 20, 80);
  doc.setFontSize(11);
  const withdrawalVals = formatPrimaryAndSecondary(totalWithdrawals);
  doc.text(withdrawalVals.primary, (pageWidth - 28) / 2 + 20, 88);
  
  // Transactions Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('All Transactions', 14, 105);
  
  autoTable(doc, {
    startY: 110,
    head: [['Date', 'Description', 'Type', 'Amount', 'Status']],
    body: transactions.map(t => {
      const amt = Math.abs(t.amount);
      const vals = formatPrimaryAndSecondary(amt);
      const sign = t.type.toLowerCase() === 'deposit' ? '+' : '-';
      return [
        new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        t.description,
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        `${sign}${vals.primary}\n(${vals.secondary})`,
        t.status.charAt(0).toUpperCase() + t.status.slice(1)
      ];
    }),
    theme: 'grid',
    headStyles: { 
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },
      1: { cellWidth: 65 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
      4: { cellWidth: 25, halign: 'center' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didDrawPage: (data) => {
      // Add header to subsequent pages
      if (data.pageNumber > 1) {
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('CAPITALMASTERS', pageWidth / 2, 15, { align: 'center' });
      }
    }
  });
  
  // Professional Footer
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, 14, pageHeight - 8);
    doc.text('CapitalMasters Investment Company | Confidential Document', pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
  }
  
  const fileName = `CapitalMasters_Transactions_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
