import { ObjectId } from 'mongodb';

/**
 * User model
 */
export interface User {
  _id?: ObjectId;
  email: string;
  password: string; // Hashed password
  name: string;
  role?: 'user' | 'admin';
  accountType: 'individual' | 'corporate' | 'institutional';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  memberSince: Date;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contact form submission model
 */
export interface ContactSubmission {
  _id?: ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

/**
 * Newsletter subscription model
 */
export interface NewsletterSubscription {
  _id?: ObjectId;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

/**
 * Portfolio model
 */
export interface Portfolio {
  _id?: ObjectId;
  userId: ObjectId;
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  holdings: Holding[];
  updatedAt: Date;
}

export interface Holding {
  name: string;
  type: string;
  value: number;
  allocation: number;
  change: number;
}

/**
 * Transaction model
 */
export interface Transaction {
  _id?: ObjectId;
  userId: ObjectId;
  type: 'deposit' | 'withdrawal' | 'dividend' | 'fee' | 'investment' | 'loan_given' | 'interest' | 'loan_repayment';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  createdAt: Date;
  investmentType?: 'equity' | 'bonds' | 'loan' | 'mutual_fund' | 'real_estate' | 'fixed_deposit' | 'commodities' | 'other';
  commodityCompany?: 'Dregif Coffee Ltd (Coffee & Cocoa)' | 'Stanfield Commodities Exchange (Coffee)' | 'Both';
  returnRate?: number;
  maturityDate?: Date;
  investmentStartDate?: Date; // When the investment actually started
  payoutStartDate?: Date; // Start of payout period (for scheduled payouts)
  payoutEndDate?: Date; // End of payout period (for scheduled payouts)
}

/**
 * Document model
 */
export interface Document {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  type: 'statement' | 'tax' | 'report' | 'agreement' | 'other';
  url: string;
  size: number;
  uploadedAt: Date;
}
