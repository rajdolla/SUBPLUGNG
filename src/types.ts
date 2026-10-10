export type NetworkProvider = 'MTN' | 'Airtel' | 'Glo' | '9mobile';

export interface DataPlan {
  id: string;
  network: NetworkProvider;
  name: string;
  validity: string;
  userPrice: number;
  vendorPrice: number;
  type: 'SME' | 'Corporate Gifting' | 'Gifting' | 'Direct';
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'data' | 'airtime' | 'utility' | 'cable' | 'education' | 'finance' | 'sms';
  icon: string;
  badge?: string;
}

export interface StoreProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  category: string;
  description: string;
  features: string[];
  inStock: boolean;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  author: string;
  category: string;
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// All first-class dashboard workspaces
export type DashboardSection =
  // Main
  | 'overview'
  | 'wallet'
  | 'transactions'
  // Services
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable'
  | 'bulk-sms'
  | 'airtime-cash'
  | 'data-pins'
  | 'exam-pins'
  | 'recharge'
  // Business
  | 'reseller'
  | 'api'
  | 'store'
  // Rewards
  | 'bonus-wallet'
  | 'referral'
  | 'cashback'
  | 'rewards'
  | 'points'
  | 'vouchers'
  // Support & Dispute Resolution
  | 'resolution'
  // Account
  | 'profile'
  | 'kyc'
  | 'transaction-pin'
  | 'notifications'
  | 'security'
  // Admin CMS & Management
  | 'admin-partners'
  | 'admin-cms'
  | 'admin-rewards'
  | 'admin-resolution'
  | 'admin-system';

export * from './types/cms';

export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected' | 'needs_more_info';

export type KycLevel = 0 | 1 | 2;

export interface BulkSmsRecipient {
  phone: string;
  normalized: string;
  isValid: boolean;
  isDuplicate: boolean;
}

export interface BulkSmsCampaign {
  id: string;
  name?: string;
  senderId: string;
  message: string;
  recipientCount: number;
  segments: number;
  estimatedCost: number;
  status: 'draft' | 'queued' | 'processing' | 'sent' | 'partially_sent' | 'failed';
  createdAt: string;
}

export interface BonusRecord {
  id: string;
  type: 'referral' | 'cashback' | 'promotion';
  description: string;
  amount: number;
  status: 'pending' | 'credited' | 'reversed';
  createdAt: string;
}
