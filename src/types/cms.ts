/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Partner Item Data Model for landing page and Admin CMS
 */
export interface PartnerItem {
  id: string;
  name: string;
  logoUrl: string;
  altText: string;
  websiteUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

/**
 * Hero Section CMS Architecture
 */
export interface HeroSectionCMS {
  badgeText: string;
  badgeSubtext: string;
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaDestination: string;
  secondaryCtaLabel: string;
  secondaryCtaDestination: string;
  trustStats: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  showMediaMockup: boolean;
  isVisible: boolean;
}

/**
 * Navigation CMS Architecture
 */
export interface NavMenuItem {
  id: string;
  label: string;
  destination: string;
  isExternal?: boolean;
  order: number;
  isVisible: boolean;
}

export interface NavigationCMS {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  menuItems: NavMenuItem[];
  primaryCtaLabel: string;
  primaryCtaDestination: string;
  secondaryCtaLabel: string;
  secondaryCtaDestination: string;
  vendorCtaLabel: string;
  isVisible: boolean;
}

/**
 * Services Section CMS Architecture
 */
export interface CmsServiceCard {
  id: string;
  name: string;
  description: string;
  category: 'data' | 'airtime' | 'utility' | 'cable' | 'education' | 'finance' | 'sms';
  iconName: string;
  displayPrice?: string;
  badge?: string;
  ctaLabel: string;
  destination: string;
  order: number;
  isVisible: boolean;
}

export interface ServicesSectionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  items: CmsServiceCard[];
  isVisible: boolean;
}

/**
 * Partners Section CMS Architecture
 */
export interface PartnersSectionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  footerNote: string;
  isVisible: boolean;
}

/**
 * Pricing Section CMS Architecture
 */
export interface CmsPricingTier {
  id: string;
  network: string;
  planName: string;
  dataAllowance: string;
  validity: string;
  price: number;
  vendorPrice: number;
  features: string[];
  ctaLabel: string;
  isFeatured?: boolean;
  order: number;
  isVisible: boolean;
}

export interface PricingSectionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  retailDiscountText: string;
  vendorDiscountText: string;
  priceListCtaLabel: string;
  tiers: CmsPricingTier[];
  isVisible: boolean;
}

/**
 * Promotions & Banners CMS Architecture
 */
export interface CmsPromoBanner {
  id: string;
  title: string;
  description: string;
  code?: string;
  discountPercentage?: number;
  ctaLabel: string;
  ctaDestination: string;
  startDate?: string;
  endDate?: string;
  targetAudience: 'all' | 'new_users' | 'vendors' | 'retail';
  badge: string;
  order: number;
  isActive: boolean;
}

export interface PromotionsCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  banners: CmsPromoBanner[];
  isVisible: boolean;
}

/**
 * Reseller & Vendor Section CMS Architecture
 */
export interface ResellerSectionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  resellerFee: number;
  apiFee: number;
  benefits: string[];
  features: string[];
  ctaLabel: string;
  secondaryCtaLabel: string;
  isVisible: boolean;
}

/**
 * Developer API Section CMS Architecture
 */
export interface DeveloperApiCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  endpointUrl: string;
  features: string[];
  ctaLabel: string;
  documentationUrl?: string;
  isVisible: boolean;
}

/**
 * Rewards Promotion CMS Architecture
 */
export interface RewardsPromotionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  features: Array<{
    title: string;
    description: string;
    type: 'cashback' | 'coupons' | 'referrals' | 'vouchers';
    badge: string;
  }>;
  ctaLabel: string;
  ctaDestination: string;
  isVisible: boolean;
}

/**
 * Social Proof & Testimonials CMS Architecture
 */
export interface CmsTestimonial {
  id: string;
  author: string;
  role: string;
  location?: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  isFeatured: boolean;
  order: number;
  isVisible: boolean;
}

export interface SocialProofCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  items: CmsTestimonial[];
  isVisible: boolean;
}

/**
 * FAQ CMS Architecture
 */
export interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'payments' | 'services' | 'reseller' | 'security';
  order: number;
  isActive: boolean;
}

export interface FaqSectionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  items: CmsFaqItem[];
  isVisible: boolean;
}

/**
 * Blog Promotion CMS Architecture
 */
export interface BlogPromotionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  maxDisplayCount: number;
  ctaLabel: string;
  isVisible: boolean;
}

/**
 * Store Promotion CMS Architecture
 */
export interface StorePromotionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  featuredProductIds: string[];
  ctaLabel: string;
  isVisible: boolean;
}

/**
 * Mobile App Download CMS Architecture
 */
export interface AppPromoSectionCMS {
  badgeText: string;
  title: string;
  subtitle: string;
  playStoreUrl: string;
  appStoreUrl: string;
  showQrCode: boolean;
  isComingSoon: boolean;
  features: string[];
  isVisible: boolean;
}

/**
 * Footer Content & Support CMS Architecture
 */
export interface CmsFooterLink {
  id: string;
  label: string;
  destination: string;
  category: 'services' | 'company' | 'legal' | 'support';
}

export interface FooterCMS {
  companyDescription: string;
  officeAddress: string;
  supportPhone: string;
  supportEmail: string;
  supportWhatsApp: string;
  copyrightText: string;
  quickLinks: CmsFooterLink[];
  socialLinks: {
    whatsapp: string;
    facebook: string;
    twitter: string;
    telegram: string;
  };
  isVisible: boolean;
}

/**
 * Global Site Settings CMS Architecture
 */
export interface GlobalSiteSettingsCMS {
  siteName: string;
  brandTagline: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl?: string;
  supportWhatsApp: string;
  supportEmail: string;
  supportPhone: string;
  announcementBarText?: string;
  isAnnouncementActive: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  defaultCtaText: string;
}

/**
 * Landing Page Section Definition for Section Builder
 */
export type LandingSectionId =
  | 'hero'
  | 'services'
  | 'partners'
  | 'pricing'
  | 'promotions'
  | 'reseller'
  | 'developerApi'
  | 'rewards'
  | 'testimonials'
  | 'faq'
  | 'blog'
  | 'store'
  | 'appDownload'
  | 'footer';

export interface SectionBuilderItem {
  id: LandingSectionId;
  name: string;
  description: string;
  isEnabled: boolean;
  order: number;
}

/**
 * Complete Landing Page CMS Structure
 */
export interface LandingPageCMS {
  siteSettings: GlobalSiteSettingsCMS;
  navigation: NavigationCMS;
  hero: HeroSectionCMS;
  services: ServicesSectionCMS;
  partnersSection: PartnersSectionCMS;
  partners: PartnerItem[];
  pricing: PricingSectionCMS;
  promotions: PromotionsCMS;
  reseller: ResellerSectionCMS;
  developerApi: DeveloperApiCMS;
  rewardsPromotion: RewardsPromotionCMS;
  socialProof: SocialProofCMS;
  faq: FaqSectionCMS;
  blogPromo: BlogPromotionCMS;
  storePromo: StorePromotionCMS;
  appPromo: AppPromoSectionCMS;
  footer: FooterCMS;
  sectionBuilder: SectionBuilderItem[];
}

export type CmsPublishStatus = 'draft' | 'preview' | 'published';

/**
 * REWARDS DATA ARCHITECTURE
 */

export interface PromoRewardItem {
  id: string;
  name: string;
  type: 'cashback' | 'discount' | 'bonus' | 'special';
  eligibleService: string;
  rewardType: 'percentage' | 'fixed';
  rewardValue: number;
  minTransaction: number;
  maxReward: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  perUserLimit?: number;
  targetAudience: 'all' | 'new_users' | 'vendors';
  terms: string;
  isActive: boolean;
}

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount: number;
  expiryDate: string;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
}

export interface CashbackRule {
  id: string;
  serviceCategory: string;
  network?: string;
  percentage: number;
  capAmount: number;
  minPurchaseAmount: number;
  isActive: boolean;
  destinationWallet: 'bonus'; // Fixed to bonus wallet
}

export interface ReferralRule {
  id: string;
  name: string;
  bonusAmount: number;
  qualificationCriteria: string;
  commissionPercentage: number;
  destinationWallet: 'bonus'; // Fixed to bonus wallet
  isActive: boolean;
}

export type VoucherStatus = 'unused' | 'redeemed' | 'expired' | 'cancelled';

export interface VoucherItem {
  id: string;
  code: string;
  value: number;
  status: VoucherStatus;
  expiryDate: string;
  redeemerUserId?: string;
  redeemerEmail?: string;
  redemptionTimestamp?: string;
  redemptionReference?: string;
  source: 'purchase' | 'promotion' | 'admin_generation' | 'support_resolution';
  destinationWallet: 'main'; // CRITICAL: Voucher redemption always credits Main Wallet!
  createdAt: string;
}

export interface RewardLedgerEntry {
  id: string;
  type: 'referral_bonus' | 'cashback_credit' | 'promo_bonus' | 'voucher_funding';
  userId: string;
  amount: number;
  walletTarget: 'bonus' | 'main'; // Voucher targets main, others bonus
  reference: string;
  description: string;
  timestamp: string;
  status: 'credited' | 'pending' | 'reversed';
}

/**
 * SUBPLUG POINTS DATA & CATALOGUE ARCHITECTURE
 */

export type PointsRewardType = 'wallet_cash' | 'airtime' | 'data';

export interface PointsTaskItem {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  taskType: 'transaction_volume' | 'referral_milestone' | 'profile_completion' | 'daily_streak' | 'utility_bill';
  minAmount?: number;
  maxClaimsPerUser?: number;
  isActive: boolean;
  category: string;
  campaignStartDate?: string;
  campaignEndDate?: string;
  eligibilityCriteria?: 'all' | 'verified_only' | 'kyc_tier_2';
}

export interface PointsRedemptionItem {
  id: string;
  title: string;
  rewardType: PointsRewardType;
  pointsRequired: number;
  cashCreditAmount?: number; // for wallet_cash: approved cash amount credited to Main Wallet
  airtimeAmount?: number; // for airtime: e.g. ₦500 or ₦1000
  network?: string; // MTN, Airtel, Glo, T2mobile
  dataPlanName?: string; // for data: e.g. "1.5GB Monthly SME"
  perUserMonthlyLimit?: number;
  isActive: boolean;
  terms: string;
  campaignStartDate?: string;
  campaignEndDate?: string;
  eligibilityRole?: 'all' | 'verified_only' | 'kyc_tier_2' | 'vendors';
  requiresManualApproval?: boolean;
}

export interface PointsSystemConfig {
  earningEnabled: boolean; // default false (coming soon)
  redemptionEnabled: boolean; // default false (coming soon)
  pointsToCashRate: number; // e.g. 1 point = 0.5 NGN
  minimumRedemptionThreshold: number; // e.g. 500 points
  minCashThresholdPoints?: number; // e.g. 500 points for cash
  minAirtimeThresholdPoints?: number; // e.g. 1000 points for airtime
  minDataThresholdPoints?: number; // e.g. 600 points for data
  pointsExpiryDays: number; // e.g. 365
  maxPointsPerMonthPerUser: number;
  eligibleNetworks: string[];
  manualApprovalAbovePoints?: number;
}

export type PointsRedemptionStatus =
  | 'pending_approval'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface PointsRedemptionRequest {
  id: string;
  reference: string;
  userId: string;
  userEmail: string;
  rewardType: PointsRewardType;
  catalogueItemId: string;
  rewardTitle: string;
  pointsDeducted: number;
  cashEquivalent?: number;
  network?: string;
  recipientPhone?: string;
  status: PointsRedemptionStatus;
  requiresManualApproval: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PointsAuditLogEntry {
  id: string;
  action: 'config_updated' | 'task_created' | 'reward_created' | 'redemption_approved' | 'redemption_rejected' | 'redemption_simulated';
  actor: string;
  details: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type AdminPermission =
  | 'voucher.view'
  | 'voucher.create'
  | 'voucher.cancel'
  | 'points.configure'
  | 'points.approve'
  | 'cms.publish'
  | 'dispute.resolve';

export interface VoucherBatchAudit {
  id: string;
  batchId: string;
  actorId: string;
  actorEmail: string;
  role: string;
  voucherCount: number;
  unitValue: number;
  totalBatchValue: number;
  prefix: string;
  expiryDate: string;
  permissionVerified: 'voucher.create';
  createdAt: string;
}

/**
 * RESOLUTION CENTER ARCHITECTURE
 */

export type ResolutionIssueType =
  | 'not_received'
  | 'pending_overdue'
  | 'provider_switch_failure'
  | 'duplicate_debit'
  | 'status_requery'
  | 'retry_dispatch'
  | 'refund_assessment'
  | 'escalation_other';

export interface ResolutionTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  serviceCategory: 'airtime' | 'data' | 'cable' | 'electricity';
  transactionReference: string;
  transactionAmount: number;
  recipientDetails: string;
  issueType: ResolutionIssueType;
  customerNote: string;
  status: 'submitted' | 'assessing' | 'requerying' | 'escalated' | 'resolved' | 'closed';
  resolutionOutcome?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
