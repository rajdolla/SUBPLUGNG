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
  category: 'data' | 'airtime' | 'utility' | 'cable' | 'education' | 'finance';
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
