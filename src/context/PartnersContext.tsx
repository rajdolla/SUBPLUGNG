/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import { PartnerItem } from '../types/cms';
import { INITIAL_PARTNERS } from '../data/partnersData';

interface PartnersContextValue {
  partners: PartnerItem[];
  activePartners: PartnerItem[];
  addPartner: (partner: Omit<PartnerItem, 'id'>) => void;
  updatePartner: (id: string, updates: Partial<PartnerItem>) => void;
  deletePartner: (id: string) => void;
  togglePartnerActive: (id: string) => void;
  reorderPartners: (sourceId: string, direction: 'up' | 'down') => void;
  resetToDefaults: () => void;
}

const PartnersContext = createContext<PartnersContextValue | undefined>(undefined);

export const PartnersProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [partners, setPartners] = useState<PartnerItem[]>(() => {
    // Attempt to load from localStorage if available during current session
    try {
      const saved = localStorage.getItem('subplug_cms_partners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial partners
    }
    return INITIAL_PARTNERS;
  });

  const savePartners = (newPartners: PartnerItem[]) => {
    setPartners(newPartners);
    try {
      localStorage.setItem('subplug_cms_partners', JSON.stringify(newPartners));
    } catch {
      // ignore
    }
  };

  const activePartners = useMemo(() => {
    return partners
      .filter((p) => p.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [partners]);

  const addPartner = (partnerData: Omit<PartnerItem, 'id'>) => {
    const newId = 'partner-' + Date.now();
    const newPartner: PartnerItem = {
      ...partnerData,
      id: newId,
    };
    savePartners([...partners, newPartner]);
  };

  const updatePartner = (id: string, updates: Partial<PartnerItem>) => {
    const updated = partners.map((p) => (p.id === id ? { ...p, ...updates } : p));
    savePartners(updated);
  };

  const deletePartner = (id: string) => {
    const updated = partners.filter((p) => p.id !== id);
    savePartners(updated);
  };

  const togglePartnerActive = (id: string) => {
    const updated = partners.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    savePartners(updated);
  };

  const reorderPartners = (sourceId: string, direction: 'up' | 'down') => {
    const sorted = [...partners].sort((a, b) => a.displayOrder - b.displayOrder);
    const index = sorted.findIndex((p) => p.id === sourceId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    // Swap displayOrder values
    const sourceOrder = sorted[index].displayOrder;
    const targetOrder = sorted[targetIndex].displayOrder;

    const updated = partners.map((p) => {
      if (p.id === sorted[index].id) return { ...p, displayOrder: targetOrder };
      if (p.id === sorted[targetIndex].id) return { ...p, displayOrder: sourceOrder };
      return p;
    });

    savePartners(updated);
  };

  const resetToDefaults = () => {
    savePartners(INITIAL_PARTNERS);
  };

  return (
    <PartnersContext.Provider
      value={{
        partners,
        activePartners,
        addPartner,
        updatePartner,
        deletePartner,
        togglePartnerActive,
        reorderPartners,
        resetToDefaults,
      }}
    >
      {children}
    </PartnersContext.Provider>
  );
};

export const usePartners = () => {
  const context = useContext(PartnersContext);
  if (!context) {
    throw new Error('usePartners must be used within a PartnersProvider');
  }
  return context;
};
