/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  LandingPageCMS,
  LandingSectionId,
  PartnerItem,
  PromoRewardItem,
  CouponItem,
  CashbackRule,
  ReferralRule,
  VoucherItem,
  RewardLedgerEntry,
  ResolutionTicket,
  CmsPublishStatus,
  PointsSystemConfig,
  PointsTaskItem,
  PointsRedemptionItem,
  PointsRedemptionRequest,
  PointsAuditLogEntry,
  VoucherBatchAudit,
  AdminPermission,
} from '../types/cms';
import {
  DEFAULT_CMS_DATA,
  DEFAULT_PROMOS,
  DEFAULT_COUPONS,
  DEFAULT_CASHBACK_RULES,
  DEFAULT_REFERRAL_RULES,
  DEFAULT_VOUCHERS,
  DEFAULT_REWARD_LEDGER,
  DEFAULT_RESOLUTION_TICKETS,
  DEFAULT_POINTS_CONFIG,
  DEFAULT_POINTS_TASKS,
  DEFAULT_POINTS_CATALOGUE,
  DEFAULT_POINTS_REDEMPTION_REQUESTS,
  DEFAULT_POINTS_AUDIT_LOG,
  DEFAULT_VOUCHER_BATCH_AUDITS,
} from '../data/defaultCmsData';

interface CmsContextValue {
  // Published & Draft CMS
  cms: LandingPageCMS;
  draftCms: LandingPageCMS;
  publishStatus: CmsPublishStatus;
  isModified: boolean;
  lastPublishedAt: string | null;

  // CMS Updating
  updateDraftSection: <K extends keyof LandingPageCMS>(sectionKey: K, data: Partial<LandingPageCMS[K]>) => void;
  reorderSection: (sectionId: LandingSectionId, direction: 'up' | 'down') => void;
  toggleSectionVisibility: (sectionId: LandingSectionId) => void;
  publishDraft: () => void;
  discardDraft: () => void;
  resetCmsToDefaults: () => void;

  // Partners Management (Integrated)
  partners: PartnerItem[];
  activePartners: PartnerItem[];
  addPartner: (partner: Omit<PartnerItem, 'id'>) => void;
  updatePartner: (id: string, updates: Partial<PartnerItem>) => void;
  deletePartner: (id: string) => void;
  togglePartnerActive: (id: string) => void;
  reorderPartners: (sourceId: string, direction: 'up' | 'down') => void;
  resetPartnersToDefaults: () => void;

  // Rewards & Voucher Management (Permission Protected)
  promos: PromoRewardItem[];
  coupons: CouponItem[];
  cashbackRules: CashbackRule[];
  referralRules: ReferralRule[];
  vouchers: VoucherItem[];
  voucherBatchAudits: VoucherBatchAudit[];
  activeAdminRole: 'standard_admin' | 'voucher_manager' | 'super_admin';
  setActiveAdminRole: (role: 'standard_admin' | 'voucher_manager' | 'super_admin') => void;
  hasPermission: (permission: AdminPermission) => boolean;
  rewardLedger: RewardLedgerEntry[];
  redeemVoucherDemo: (code: string, userEmail?: string) => { success: boolean; message: string; voucher?: VoucherItem; value?: number };
  generateVouchers: (params: { count: number; value: number; prefix?: string; expiryDate: string }) => {
    success: boolean;
    message: string;
    vouchers?: VoucherItem[];
    audit?: VoucherBatchAudit;
  };
  toggleVoucherStatus: (id: string, newStatus: VoucherItem['status']) => { success: boolean; message: string };
  addPromo: (promo: Omit<PromoRewardItem, 'id'>) => void;
  togglePromoActive: (id: string) => void;
  deletePromo: (id: string) => void;
  addCoupon: (coupon: Omit<CouponItem, 'id'>) => void;
  toggleCouponActive: (id: string) => void;
  deleteCoupon: (id: string) => void;

  // SUBPLUG Points (Future Earning & Redemption Architecture)
  pointsConfig: PointsSystemConfig;
  updatePointsConfig: (updates: Partial<PointsSystemConfig>) => void;
  pointsTasks: PointsTaskItem[];
  addPointsTask: (task: Omit<PointsTaskItem, 'id'>) => void;
  togglePointsTask: (id: string) => void;
  deletePointsTask: (id: string) => void;
  pointsCatalogue: PointsRedemptionItem[];
  addPointsRedemptionItem: (item: Omit<PointsRedemptionItem, 'id'>) => void;
  togglePointsCatalogueItem: (id: string) => void;
  deletePointsCatalogueItem: (id: string) => void;
  resetPointsToDefaults: () => void;
  pointsRedemptionRequests: PointsRedemptionRequest[];
  pointsAuditLog: PointsAuditLogEntry[];
  approvePointsRedemption: (id: string, reviewerEmail?: string) => void;
  rejectPointsRedemption: (id: string, reason: string, reviewerEmail?: string) => void;
  logPointsAudit: (action: PointsAuditLogEntry['action'], details: string) => void;

  // Resolution Center
  resolutionTickets: ResolutionTicket[];
  createResolutionTicket: (ticket: Omit<ResolutionTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'status'>) => ResolutionTicket;
  updateTicketStatus: (id: string, status: ResolutionTicket['status'], outcome?: string) => void;
}

const CmsContext = createContext<CmsContextValue | undefined>(undefined);

const CMS_STORAGE_KEY = 'subplug_landing_cms_v2';
const CMS_DRAFT_KEY = 'subplug_landing_cms_draft_v2';
const REWARDS_STORAGE_KEY = 'subplug_rewards_v2';
const RESOLUTION_STORAGE_KEY = 'subplug_resolution_v2';

export const CmsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Published CMS State
  const [cms, setCms] = useState<LandingPageCMS>(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.hero && parsed.services) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CMS_DATA;
  });

  // Draft CMS State (Admin Workspace edits this)
  const [draftCms, setDraftCms] = useState<LandingPageCMS>(() => {
    try {
      const savedDraft = localStorage.getItem(CMS_DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.hero) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CMS_DATA;
  });

  const [publishStatus, setPublishStatus] = useState<CmsPublishStatus>('published');
  const [isModified, setIsModified] = useState(false);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(() => {
    return localStorage.getItem('subplug_cms_last_published') || new Date().toISOString();
  });

  // Rewards State
  const [promos, setPromos] = useState<PromoRewardItem[]>(() => {
    try {
      const saved = localStorage.getItem(REWARDS_STORAGE_KEY + '_promos');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROMOS;
  });

  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    try {
      const saved = localStorage.getItem(REWARDS_STORAGE_KEY + '_coupons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_COUPONS;
  });

  const [cashbackRules, setCashbackRules] = useState<CashbackRule[]>(() => {
    try {
      const saved = localStorage.getItem(REWARDS_STORAGE_KEY + '_cb_rules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CASHBACK_RULES;
  });

  const [referralRules] = useState<ReferralRule[]>(DEFAULT_REFERRAL_RULES);

  const [vouchers, setVouchers] = useState<VoucherItem[]>(() => {
    try {
      const saved = localStorage.getItem(REWARDS_STORAGE_KEY + '_vouchers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_VOUCHERS;
  });

  const [rewardLedger, setRewardLedger] = useState<RewardLedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(REWARDS_STORAGE_KEY + '_ledger');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_REWARD_LEDGER;
  });

  // Resolution Center State
  const [resolutionTickets, setResolutionTickets] = useState<ResolutionTicket[]>(() => {
    try {
      const saved = localStorage.getItem(RESOLUTION_STORAGE_KEY + '_tickets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_RESOLUTION_TICKETS;
  });

  // SUBPLUG Points State (Future Earning & Redemption Architecture)
  const [pointsConfig, setPointsConfig] = useState<PointsSystemConfig>(() => {
    try {
      const saved = localStorage.getItem('subplug_points_config_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_POINTS_CONFIG;
  });

  const [pointsTasks, setPointsTasks] = useState<PointsTaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('subplug_points_tasks_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_POINTS_TASKS;
  });

  const [pointsCatalogue, setPointsCatalogue] = useState<PointsRedemptionItem[]>(() => {
    try {
      const saved = localStorage.getItem('subplug_points_catalogue_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_POINTS_CATALOGUE;
  });

  // Points Redemption Requests Queue (Under Review / Manual Approval Workflow)
  const [pointsRedemptionRequests, setPointsRedemptionRequests] = useState<PointsRedemptionRequest[]>(() => {
    try {
      const saved = localStorage.getItem('subplug_points_requests_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_POINTS_REDEMPTION_REQUESTS;
  });

  // Points System Audit Log
  const [pointsAuditLog, setPointsAuditLog] = useState<PointsAuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('subplug_points_audit_log_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_POINTS_AUDIT_LOG;
  });

  // Voucher Batch Audits (actor, timestamp, unit value, total value, permission)
  const [voucherBatchAudits, setVoucherBatchAudits] = useState<VoucherBatchAudit[]>(() => {
    try {
      const saved = localStorage.getItem('subplug_voucher_batch_audits_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_VOUCHER_BATCH_AUDITS;
  });

  // Granular Admin Role for Simulation & Security Audit Testing
  const [activeAdminRole, setActiveAdminRole] = useState<'standard_admin' | 'voucher_manager' | 'super_admin'>('voucher_manager');

  const hasPermission = (permission: AdminPermission): boolean => {
    if (activeAdminRole === 'super_admin') return true;
    if (activeAdminRole === 'voucher_manager') {
      return ['voucher.view', 'voucher.create', 'voucher.cancel', 'points.configure', 'points.approve', 'cms.publish'].includes(permission);
    }
    // standard_admin: view only for vouchers, no voucher.create, no voucher.cancel
    return ['voucher.view', 'points.configure', 'cms.publish'].includes(permission);
  };

  const logPointsAudit = (action: PointsAuditLogEntry['action'], details: string) => {
    const entry: PointsAuditLogEntry = {
      id: 'aud-' + Date.now(),
      action,
      actor: activeAdminRole === 'super_admin' ? 'superadmin@subplug.ng' : 'admin@subplug.ng',
      details,
      timestamp: new Date().toISOString(),
    };
    setPointsAuditLog((prev) => {
      const updated = [entry, ...prev];
      try {
        localStorage.setItem('subplug_points_audit_log_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const approvePointsRedemption = (id: string, reviewerEmail: string = 'admin@subplug.ng') => {
    if (!hasPermission('points.approve')) {
      alert('Permission Denied: points.approve permission required.');
      return;
    }
    const now = new Date().toISOString();
    setPointsRedemptionRequests((prev) => {
      const updated = prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'approved' as const,
              reviewedBy: reviewerEmail,
              reviewedAt: now,
              completedAt: now,
            }
          : req
      );
      try {
        localStorage.setItem('subplug_points_requests_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logPointsAudit('redemption_approved', `Redemption ${id} manually approved by ${reviewerEmail}.`);
  };

  const rejectPointsRedemption = (id: string, reason: string, reviewerEmail: string = 'admin@subplug.ng') => {
    if (!hasPermission('points.approve')) {
      alert('Permission Denied: points.approve permission required.');
      return;
    }
    const now = new Date().toISOString();
    setPointsRedemptionRequests((prev) => {
      const updated = prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'rejected' as const,
              reviewedBy: reviewerEmail,
              reviewedAt: now,
              rejectionReason: reason,
            }
          : req
      );
      try {
        localStorage.setItem('subplug_points_requests_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logPointsAudit('redemption_rejected', `Redemption ${id} rejected by ${reviewerEmail}: ${reason}.`);
  };

  const updatePointsConfig = (updates: Partial<PointsSystemConfig>) => {
    setPointsConfig((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('subplug_points_config_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addPointsTask = (task: Omit<PointsTaskItem, 'id'>) => {
    const newTask: PointsTaskItem = {
      ...task,
      id: 'tsk-' + Date.now(),
    };
    setPointsTasks((prev) => {
      const updated = [newTask, ...prev];
      try {
        localStorage.setItem('subplug_points_tasks_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const togglePointsTask = (id: string) => {
    setPointsTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t));
      try {
        localStorage.setItem('subplug_points_tasks_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deletePointsTask = (id: string) => {
    setPointsTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('subplug_points_tasks_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addPointsRedemptionItem = (item: Omit<PointsRedemptionItem, 'id'>) => {
    const newItem: PointsRedemptionItem = {
      ...item,
      id: 'red-' + Date.now(),
    };
    setPointsCatalogue((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('subplug_points_catalogue_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const togglePointsCatalogueItem = (id: string) => {
    setPointsCatalogue((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item));
      try {
        localStorage.setItem('subplug_points_catalogue_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deletePointsCatalogueItem = (id: string) => {
    setPointsCatalogue((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('subplug_points_catalogue_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetPointsToDefaults = () => {
    setPointsConfig(DEFAULT_POINTS_CONFIG);
    setPointsTasks(DEFAULT_POINTS_TASKS);
    setPointsCatalogue(DEFAULT_POINTS_CATALOGUE);
    try {
      localStorage.removeItem('subplug_points_config_v2');
      localStorage.removeItem('subplug_points_tasks_v2');
      localStorage.removeItem('subplug_points_catalogue_v2');
    } catch {}
  };

  // Keep draft in sync with persistence
  const saveDraft = (newDraft: LandingPageCMS) => {
    setDraftCms(newDraft);
    setIsModified(true);
    setPublishStatus('draft');
    try {
      localStorage.setItem(CMS_DRAFT_KEY, JSON.stringify(newDraft));
    } catch {}
  };

  // Publish Draft to Live
  const publishDraft = () => {
    setCms(draftCms);
    setIsModified(false);
    setPublishStatus('published');
    const now = new Date().toISOString();
    setLastPublishedAt(now);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(draftCms));
      localStorage.setItem('subplug_cms_last_published', now);
    } catch {}
  };

  const discardDraft = () => {
    setDraftCms(cms);
    setIsModified(false);
    setPublishStatus('published');
    try {
      localStorage.setItem(CMS_DRAFT_KEY, JSON.stringify(cms));
    } catch {}
  };

  const resetCmsToDefaults = () => {
    setCms(DEFAULT_CMS_DATA);
    setDraftCms(DEFAULT_CMS_DATA);
    setIsModified(false);
    setPublishStatus('published');
    try {
      localStorage.removeItem(CMS_STORAGE_KEY);
      localStorage.removeItem(CMS_DRAFT_KEY);
    } catch {}
  };

  // Update a specific section in draft
  const updateDraftSection = <K extends keyof LandingPageCMS>(
    sectionKey: K,
    data: Partial<LandingPageCMS[K]>
  ) => {
    const updatedDraft = {
      ...draftCms,
      [sectionKey]: Array.isArray(draftCms[sectionKey])
        ? (data as unknown as LandingPageCMS[K])
        : { ...(draftCms[sectionKey] as object), ...(data as object) },
    };
    saveDraft(updatedDraft);
  };

  // Reorder Sections in Landing Page Builder
  const reorderSection = (sectionId: LandingSectionId, direction: 'up' | 'down') => {
    const sorted = [...draftCms.sectionBuilder].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((s) => s.id === sectionId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const currentOrder = sorted[index].order;
    const targetOrder = sorted[targetIndex].order;

    const updatedBuilder = draftCms.sectionBuilder.map((sec) => {
      if (sec.id === sorted[index].id) return { ...sec, order: targetOrder };
      if (sec.id === sorted[targetIndex].id) return { ...sec, order: currentOrder };
      return sec;
    });

    saveDraft({ ...draftCms, sectionBuilder: updatedBuilder });
  };

  // Toggle Section Visibility
  const toggleSectionVisibility = (sectionId: LandingSectionId) => {
    const updatedBuilder = draftCms.sectionBuilder.map((sec) =>
      sec.id === sectionId ? { ...sec, isEnabled: !sec.isEnabled } : sec
    );
    saveDraft({ ...draftCms, sectionBuilder: updatedBuilder });
  };

  // PARTNERS (Syncs both in CMS and draft)
  const activePartners = useMemo(() => {
    return (cms.partners || [])
      .filter((p) => p.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [cms.partners]);

  const addPartner = (partnerData: Omit<PartnerItem, 'id'>) => {
    const newId = 'partner-' + Date.now();
    const newPartner: PartnerItem = { ...partnerData, id: newId };
    const updatedPartners = [...draftCms.partners, newPartner];
    saveDraft({ ...draftCms, partners: updatedPartners });
    // Also publish immediately for ease of session testing
    setCms((prev) => ({ ...prev, partners: updatedPartners }));
  };

  const updatePartner = (id: string, updates: Partial<PartnerItem>) => {
    const updated = draftCms.partners.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveDraft({ ...draftCms, partners: updated });
    setCms((prev) => ({ ...prev, partners: updated }));
  };

  const deletePartner = (id: string) => {
    const updated = draftCms.partners.filter((p) => p.id !== id);
    saveDraft({ ...draftCms, partners: updated });
    setCms((prev) => ({ ...prev, partners: updated }));
  };

  const togglePartnerActive = (id: string) => {
    const updated = draftCms.partners.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    saveDraft({ ...draftCms, partners: updated });
    setCms((prev) => ({ ...prev, partners: updated }));
  };

  const reorderPartners = (sourceId: string, direction: 'up' | 'down') => {
    const sorted = [...draftCms.partners].sort((a, b) => a.displayOrder - b.displayOrder);
    const index = sorted.findIndex((p) => p.id === sourceId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const sourceOrder = sorted[index].displayOrder;
    const targetOrder = sorted[targetIndex].displayOrder;

    const updated = draftCms.partners.map((p) => {
      if (p.id === sorted[index].id) return { ...p, displayOrder: targetOrder };
      if (p.id === sorted[targetIndex].id) return { ...p, displayOrder: sourceOrder };
      return p;
    });

    saveDraft({ ...draftCms, partners: updated });
    setCms((prev) => ({ ...prev, partners: updated }));
  };

  const resetPartnersToDefaults = () => {
    saveDraft({ ...draftCms, partners: DEFAULT_CMS_DATA.partners });
    setCms((prev) => ({ ...prev, partners: DEFAULT_CMS_DATA.partners }));
  };

  // REWARDS METHODS
  const redeemVoucherDemo = (code: string, userEmail: string = 'customer@subplug.ng') => {
    const normalized = code.trim().toUpperCase();
    const existingIndex = vouchers.findIndex(
      (v) => v.code.toUpperCase() === normalized
    );

    if (existingIndex === -1) {
      return {
        success: false,
        message: 'Invalid voucher code. Please check characters and try again.',
      };
    }

    const targetVoucher = vouchers[existingIndex];

    if (targetVoucher.status === 'redeemed') {
      return {
        success: false,
        message: 'This voucher has already been redeemed. Each voucher can only be used once.',
      };
    }

    if (targetVoucher.status === 'expired' || targetVoucher.status === 'cancelled') {
      return {
        success: false,
        message: `This voucher is ${targetVoucher.status} and cannot be processed.`,
      };
    }

    // Mark as redeemed in frontend state (funding goes to MAIN WALLET)
    const now = new Date().toISOString();
    const ref = 'VCH-TX-' + Math.floor(100000 + Math.random() * 900000);
    const updatedVoucher: VoucherItem = {
      ...targetVoucher,
      status: 'redeemed',
      redeemerEmail: userEmail,
      redemptionTimestamp: now,
      redemptionReference: ref,
    };

    const updatedVouchers = [...vouchers];
    updatedVouchers[existingIndex] = updatedVoucher;
    setVouchers(updatedVouchers);

    // Create reward/funding ledger entry
    const newLedgerEntry: RewardLedgerEntry = {
      id: 'led-' + Date.now(),
      type: 'voucher_funding',
      userId: userEmail,
      amount: targetVoucher.value,
      walletTarget: 'main', // FUNDING TO MAIN WALLET
      reference: ref,
      description: `Voucher Funding ₦${targetVoucher.value.toLocaleString()} (${targetVoucher.code})`,
      timestamp: now,
      status: 'credited',
    };
    const updatedLedger = [newLedgerEntry, ...rewardLedger];
    setRewardLedger(updatedLedger);

    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_vouchers', JSON.stringify(updatedVouchers));
      localStorage.setItem(REWARDS_STORAGE_KEY + '_ledger', JSON.stringify(updatedLedger));
    } catch {}

    return {
      success: true,
      message: `Demo Voucher redeemed successfully! ₦${targetVoucher.value.toLocaleString()} allocated for Main Wallet funding.`,
      voucher: updatedVoucher,
      value: targetVoucher.value,
    };
  };

  const generateVouchers = (params: { count: number; value: number; prefix?: string; expiryDate: string }) => {
    if (!hasPermission('voucher.create')) {
      return {
        success: false,
        message: 'Permission Denied: voucher.create permission is required. General admins possess view-only audit permissions.',
      };
    }

    const { count, value, prefix = 'SP', expiryDate } = params;
    const maxAllowed = activeAdminRole === 'super_admin' ? 50 : 20;
    const maxValue = activeAdminRole === 'super_admin' ? 50000 : 10000;

    if (count > maxAllowed) {
      return {
        success: false,
        message: `Exceeded batch limit: Maximum permitted vouchers per batch for your role is ${maxAllowed}.`,
      };
    }
    if (value > maxValue) {
      return {
        success: false,
        message: `Exceeded face value limit: Maximum permitted voucher face value is ₦${maxValue.toLocaleString()}.`,
      };
    }

    const newItems: VoucherItem[] = [];
    const now = new Date().toISOString();
    const batchId = 'BATCH-' + Date.now().toString(36).toUpperCase();

    for (let i = 0; i < count; i++) {
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const code = `${prefix}-${value}-${randomStr}${randomNum}`;
      newItems.push({
        id: 'vch-' + Date.now() + '-' + i,
        code,
        value,
        status: 'unused',
        expiryDate,
        source: 'admin_generation',
        destinationWallet: 'main',
        createdAt: now,
      });
    }

    const updated = [...newItems, ...vouchers];
    setVouchers(updated);

    const auditEntry: VoucherBatchAudit = {
      id: 'vba-' + Date.now(),
      batchId,
      actorId: 'admin-curr',
      actorEmail: activeAdminRole === 'super_admin' ? 'superadmin@subplug.ng' : 'vouchermanager@subplug.ng',
      role: activeAdminRole,
      voucherCount: count,
      unitValue: value,
      totalBatchValue: count * value,
      prefix,
      expiryDate,
      permissionVerified: 'voucher.create',
      createdAt: now,
    };

    const updatedAudits = [auditEntry, ...voucherBatchAudits];
    setVoucherBatchAudits(updatedAudits);

    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_vouchers', JSON.stringify(updated));
      localStorage.setItem('subplug_voucher_batch_audits_v2', JSON.stringify(updatedAudits));
    } catch {}

    return {
      success: true,
      message: `Batch ${batchId} generated successfully (${count} vouchers totaling ₦${(count * value).toLocaleString()}). Actor & voucher.create permission verified.`,
      vouchers: newItems,
      audit: auditEntry,
    };
  };

  const toggleVoucherStatus = (id: string, newStatus: VoucherItem['status']) => {
    if (!hasPermission('voucher.cancel')) {
      return {
        success: false,
        message: 'Permission Denied: voucher.cancel permission required to alter voucher lifecycle states.',
      };
    }
    const updated = vouchers.map((v) => (v.id === id ? { ...v, status: newStatus } : v));
    setVouchers(updated);
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_vouchers', JSON.stringify(updated));
    } catch {}
    return { success: true, message: `Voucher state updated to ${newStatus}.` };
  };

  const addPromo = (promoData: Omit<PromoRewardItem, 'id'>) => {
    const newPromo: PromoRewardItem = {
      ...promoData,
      id: 'promo-' + Date.now(),
    };
    const updated = [newPromo, ...promos];
    setPromos(updated);
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_promos', JSON.stringify(updated));
    } catch {}
  };

  const togglePromoActive = (id: string) => {
    const updated = promos.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    setPromos(updated);
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_promos', JSON.stringify(updated));
    } catch {}
  };

  const deletePromo = (id: string) => {
    const updated = promos.filter((p) => p.id !== id);
    setPromos(updated);
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_promos', JSON.stringify(updated));
    } catch {}
  };

  const addCoupon = (couponData: Omit<CouponItem, 'id'>) => {
    const newCoupon: CouponItem = {
      ...couponData,
      id: 'coupon-' + Date.now(),
    };
    const updated = [newCoupon, ...coupons];
    setCoupons(updated);
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_coupons', JSON.stringify(updated));
    } catch {}
  };

  const toggleCouponActive = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    setCoupons(updated);
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_coupons', JSON.stringify(updated));
    } catch {}
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    setCoupons(updated);
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY + '_coupons', JSON.stringify(updated));
    } catch {}
  };

  // RESOLUTION CENTER METHODS
  const createResolutionTicket = (
    ticketData: Omit<ResolutionTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    const now = new Date().toISOString();
    const ticketNumber = 'TKT-2026-' + Math.floor(100 + Math.random() * 900);
    const newTicket: ResolutionTicket = {
      ...ticketData,
      id: 'res-' + Date.now(),
      ticketNumber,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newTicket, ...resolutionTickets];
    setResolutionTickets(updated);
    try {
      localStorage.setItem(RESOLUTION_STORAGE_KEY + '_tickets', JSON.stringify(updated));
    } catch {}
    return newTicket;
  };

  const updateTicketStatus = (
    id: string,
    status: ResolutionTicket['status'],
    outcome?: string
  ) => {
    const now = new Date().toISOString();
    const updated = resolutionTickets.map((t) =>
      t.id === id
        ? {
            ...t,
            status,
            resolutionOutcome: outcome || t.resolutionOutcome,
            updatedAt: now,
          }
        : t
    );
    setResolutionTickets(updated);
    try {
      localStorage.setItem(RESOLUTION_STORAGE_KEY + '_tickets', JSON.stringify(updated));
    } catch {}
  };

  return (
    <CmsContext.Provider
      value={{
        cms,
        draftCms,
        publishStatus,
        isModified,
        lastPublishedAt,
        updateDraftSection,
        reorderSection,
        toggleSectionVisibility,
        publishDraft,
        discardDraft,
        resetCmsToDefaults,

        partners: draftCms.partners || [],
        activePartners,
        addPartner,
        updatePartner,
        deletePartner,
        togglePartnerActive,
        reorderPartners,
        resetPartnersToDefaults,

        promos,
        coupons,
        cashbackRules,
        referralRules,
        vouchers,
        voucherBatchAudits,
        activeAdminRole,
        setActiveAdminRole,
        hasPermission,
        rewardLedger,
        redeemVoucherDemo,
        generateVouchers,
        toggleVoucherStatus,
        addPromo,
        togglePromoActive,
        deletePromo,
        addCoupon,
        toggleCouponActive,
        deleteCoupon,

        pointsConfig,
        updatePointsConfig,
        pointsTasks,
        addPointsTask,
        togglePointsTask,
        deletePointsTask,
        pointsCatalogue,
        addPointsRedemptionItem,
        togglePointsCatalogueItem,
        deletePointsCatalogueItem,
        resetPointsToDefaults,
        pointsRedemptionRequests,
        pointsAuditLog,
        approvePointsRedemption,
        rejectPointsRedemption,
        logPointsAudit,

        resolutionTickets,
        createResolutionTicket,
        updateTicketStatus,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
