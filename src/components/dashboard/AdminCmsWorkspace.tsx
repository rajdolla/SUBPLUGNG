/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  Sliders,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Upload,
  RotateCcw,
  Sparkles,
  Save,
  Trash2,
  Plus,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Layers,
  Settings,
  Tv,
  HelpCircle,
  MessageSquare,
  Gift,
  Building2,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { LandingSectionId, PartnerItem } from '../../types/cms';

export const AdminCmsWorkspace: React.FC = () => {
  const {
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
    partners,
    activePartners,
    addPartner,
    updatePartner,
    deletePartner,
    togglePartnerActive,
    reorderPartners,
    resetPartnersToDefaults,
  } = useCms();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'builder' | 'hero' | 'partners' | 'services' | 'pricing' | 'promotions' | 'rewards' | 'settings'
  >('builder');

  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Partner editor modal state
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [pName, setPName] = useState('');
  const [pLogoUrl, setPLogoUrl] = useState('');
  const [pAltText, setPAltText] = useState('');
  const [pWebsiteUrl, setPWebsiteUrl] = useState('');
  const [pDisplayOrder, setPDisplayOrder] = useState(1);
  const [pIsActive, setPIsActive] = useState(true);

  // Quick helper to show status notifications
  const notify = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 5000);
  };

  const handlePublish = () => {
    publishDraft();
    notify('Landing page published successfully! Changes are live across all public viewpoints.');
  };

  const handleDiscard = () => {
    discardDraft();
    notify('Draft discarded. Reset to latest published version.');
  };

  const openAddPartnerModal = () => {
    setEditingPartner(null);
    setPName('');
    setPLogoUrl('');
    setPAltText('');
    setPWebsiteUrl('');
    setPDisplayOrder(partners.length + 1);
    setPIsActive(true);
    setPartnerModalOpen(true);
  };

  const openEditPartnerModal = (p: PartnerItem) => {
    setEditingPartner(p);
    setPName(p.name);
    setPLogoUrl(p.logoUrl);
    setPAltText(p.altText);
    setPWebsiteUrl(p.websiteUrl || '');
    setPDisplayOrder(p.displayOrder);
    setPIsActive(p.isActive);
    setPartnerModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, SVG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPLogoUrl(result);
        if (!pAltText && pName) {
          setPAltText(`${pName} Official Partner`);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    const finalAlt = pAltText.trim() || `${pName.trim()} Official Partner`;

    if (editingPartner) {
      updatePartner(editingPartner.id, {
        name: pName.trim(),
        logoUrl: pLogoUrl.trim() || editingPartner.logoUrl,
        altText: finalAlt,
        websiteUrl: pWebsiteUrl.trim() || undefined,
        displayOrder: Number(pDisplayOrder) || editingPartner.displayOrder,
        isActive: pIsActive,
      });
      notify(`Updated partner "${pName.trim()}".`);
    } else {
      addPartner({
        name: pName.trim(),
        logoUrl: pLogoUrl.trim() || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><rect width="200" height="80" fill="%230284C7"/><text x="100" y="48" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="%23ffffff">' + encodeURIComponent(pName.trim()) + '</text></svg>',
        altText: finalAlt,
        websiteUrl: pWebsiteUrl.trim() || undefined,
        displayOrder: Number(pDisplayOrder) || partners.length + 1,
        isActive: pIsActive,
      });
      notify(`Added new partner "${pName.trim()}".`);
    }

    setPartnerModalOpen(false);
  };

  const sortedSections = [...draftCms.sectionBuilder].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Lifecycle Control */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wide">
            <Globe className="h-3.5 w-3.5" />
            <span>FULL LANDING PAGE CMS ARCHITECTURE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Content Management Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Reorder landing page sections, toggle visibility, customize hero headlines, configure carrier interconnect partners, and publish live changes without writing code.
          </p>
        </div>

        {/* Publish / Draft Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {isModified && (
            <button
              onClick={handleDiscard}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Discard Changes
            </button>
          )}

          <button
            onClick={handlePublish}
            disabled={!isModified}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              isModified
                ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>{isModified ? 'Publish Draft to Live' : 'Published (Up to Date)'}</span>
          </button>
        </div>
      </div>

      {/* Lifecycle Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isModified ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
            }`}
          />
          <span className="text-slate-300">
            Current Status:{' '}
            <strong className="text-white">
              {isModified ? 'Unpublished Draft Changes' : 'Published & Live'}
            </strong>
          </span>
          {lastPublishedAt && (
            <span className="text-slate-500 text-[11px] font-mono hidden md:inline">
              · Last published: {new Date(lastPublishedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <button
          onClick={resetCmsToDefaults}
          className="text-slate-400 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All CMS Content to Defaults</span>
        </button>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* 2. Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('builder')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'builder'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Section Builder ({draftCms.sectionBuilder.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('partners')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'partners'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Our Partners (MTN, Glo, T2mobile...)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('hero')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'hero'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Hero Banner</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('services')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'services'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Tv className="h-4 w-4" />
          <span>Services Grid</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('pricing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'pricing'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Wholesale Pricing</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('promotions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'promotions'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Promotions</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('rewards')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'rewards'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Gift className="h-4 w-4" />
          <span>Rewards Promo Card</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'settings'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Site Settings & Announcement</span>
        </button>
      </div>

      {/* 3. TAB A: SECTION BUILDER */}
      {activeAdminTab === 'builder' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Landing Page Section Builder & Reordering
              </h2>
              <p className="text-xs text-slate-400">
                Move sections up or down to rearrange the public landing page layout. Toggle visibility to instantly hide or show sections.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-3">Order</th>
                    <th className="py-3 px-3">Section Name</th>
                    <th className="py-3 px-3">Description</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {sortedSections.map((sec, idx) => (
                    <tr key={sec.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                          <span className="w-4 text-center">{sec.order}</span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => reorderSection(sec.id, 'up')}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === sortedSections.length - 1}
                              onClick={() => reorderSection(sec.id, 'down')}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-bold text-white">{sec.name}</td>
                      <td className="py-3 px-3 text-slate-400">{sec.description}</td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(sec.id)}
                          className={`px-2.5 py-1 rounded-full font-mono font-bold text-[10px] uppercase transition-colors cursor-pointer ${
                            sec.isEnabled
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {sec.isEnabled ? 'Enabled' : 'Hidden'}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (sec.id === 'partners') setActiveAdminTab('partners');
                            else if (sec.id === 'hero') setActiveAdminTab('hero');
                            else if (sec.id === 'services') setActiveAdminTab('services');
                            else if (sec.id === 'pricing') setActiveAdminTab('pricing');
                            else if (sec.id === 'promotions') setActiveAdminTab('promotions');
                            else if (sec.id === 'rewards') setActiveAdminTab('rewards');
                            else setActiveAdminTab('settings');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Edit Content
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB B: OUR PARTNERS (MTN, Glo, T2mobile, Airtel, Smile, Spectranet) */}
      {activeAdminTab === 'partners' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Our Partners Manager (Carrier Interconnects)
                </h2>
                <p className="text-xs text-slate-400">
                  Manage logos for MTN, Glo, T2mobile, Airtel, Smile, Spectranet shown in the light container on the landing page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetPartnersToDefaults}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Reset Partners
                </button>
                <button
                  onClick={openAddPartnerModal}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Partner</span>
                </button>
              </div>
            </div>

            {/* Partners Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Order</th>
                    <th className="py-2.5 px-3">Logo</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Alt Text</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {partners.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">
                        <div className="flex items-center gap-1">
                          <span>{p.displayOrder}</span>
                          <div className="flex flex-col">
                            <button
                              disabled={idx === 0}
                              onClick={() => reorderPartners(p.id, 'up')}
                              className="p-0.5 hover:text-white text-slate-500 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              disabled={idx === partners.length - 1}
                              onClick={() => reorderPartners(p.id, 'down')}
                              className="p-0.5 hover:text-white text-slate-500 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="h-10 w-20 bg-white rounded-lg p-1 flex items-center justify-center border border-slate-300 shadow-sm">
                          <img
                            src={p.logoUrl}
                            alt={p.altText}
                            className="max-h-7 max-w-[70px] object-contain"
                          />
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{p.altText}</td>

                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => togglePartnerActive(p.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase cursor-pointer ${
                            p.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {p.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditPartnerModal(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deletePartner(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB C: HERO BANNER EDITOR */}
      {activeAdminTab === 'hero' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5 max-w-3xl">
            <h2 className="text-base font-bold text-white">Hero Banner Headline & Copy</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Tagline / Announcement Badge Text
                </label>
                <input
                  type="text"
                  value={draftCms.hero.badgeText}
                  onChange={(e) => updateDraftSection('hero', { badgeText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                    Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={draftCms.hero.titleLine1}
                    onChange={(e) => updateDraftSection('hero', { titleLine1: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                    Headline Highlight Text
                  </label>
                  <input
                    type="text"
                    value={draftCms.hero.titleHighlight}
                    onChange={(e) => updateDraftSection('hero', { titleHighlight: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Sub-headline Description
                </label>
                <textarea
                  rows={3}
                  value={draftCms.hero.subtitle}
                  onChange={(e) => updateDraftSection('hero', { subtitle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={draftCms.hero.primaryCtaLabel}
                    onChange={(e) => updateDraftSection('hero', { primaryCtaLabel: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={draftCms.hero.secondaryCtaLabel}
                    onChange={(e) => updateDraftSection('hero', { secondaryCtaLabel: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB D: SERVICES GRID EDITOR */}
      {activeAdminTab === 'services' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5 max-w-3xl">
            <h2 className="text-base font-bold text-white">Services Section Headings & Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={draftCms.services.title}
                  onChange={(e) => updateDraftSection('services', { title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={draftCms.services.subtitle}
                  onChange={(e) => updateDraftSection('services', { subtitle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB E: WHOLESALE PRICING EDITOR */}
      {activeAdminTab === 'pricing' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5 max-w-3xl">
            <h2 className="text-base font-bold text-white">Pricing Section Headings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={draftCms.pricing.title}
                  onChange={(e) => updateDraftSection('pricing', { title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={draftCms.pricing.subtitle}
                  onChange={(e) => updateDraftSection('pricing', { subtitle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB F: PROMOTIONS */}
      {activeAdminTab === 'promotions' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Active Promotional Banners on Landing Page</h2>
            <div className="space-y-3">
              {draftCms.promotions.banners.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{b.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {b.code ? `Code: ${b.code}` : 'Automatic'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB G: REWARDS PROMO CARD */}
      {activeAdminTab === 'rewards' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 max-w-3xl">
            <h2 className="text-base font-bold text-white">Rewards Promotion Section Copy</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={draftCms.rewardsPromotion.title}
                  onChange={(e) => updateDraftSection('rewardsPromotion', { title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={draftCms.rewardsPromotion.subtitle}
                  onChange={(e) => updateDraftSection('rewardsPromotion', { subtitle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB H: SITE SETTINGS & ANNOUNCEMENT */}
      {activeAdminTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5 max-w-3xl">
            <h2 className="text-base font-bold text-white">Global Site Settings & Support Dispatch</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Top Announcement Bar Message
                </label>
                <input
                  type="text"
                  value={draftCms.siteSettings.announcementBarText || ''}
                  onChange={(e) => updateDraftSection('siteSettings', { announcementBarText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="announcementActive"
                  checked={draftCms.siteSettings.isAnnouncementActive}
                  onChange={(e) => updateDraftSection('siteSettings', { isAnnouncementActive: e.target.checked })}
                  className="rounded border-slate-800 text-cyan-500"
                />
                <label htmlFor="announcementActive" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Display Announcement Bar across site header
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                    Support WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={draftCms.siteSettings.supportWhatsApp}
                    onChange={(e) => updateDraftSection('siteSettings', { supportWhatsApp: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">
                    Support Email
                  </label>
                  <input
                    type="text"
                    value={draftCms.siteSettings.supportEmail}
                    onChange={(e) => updateDraftSection('siteSettings', { supportEmail: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD / EDIT PARTNER */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white">
              {editingPartner ? `Edit Partner: ${editingPartner.name}` : 'Add New Partner'}
            </h3>

            <form onSubmit={handleSavePartner} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Partner / Network Name</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. T2mobile"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  value={pAltText}
                  onChange={(e) => setPAltText(e.target.value)}
                  placeholder="e.g. T2mobile Telecommunications Official Partner"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Partner Logo (SVG / Image File)</label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {pLogoUrl && (
                    <div className="h-10 w-24 bg-white rounded-lg p-1 flex items-center justify-center border border-slate-300 shadow-sm">
                      <img src={pLogoUrl} alt="Preview" className="max-h-7 max-w-[80px] object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  value={pWebsiteUrl}
                  onChange={(e) => setPWebsiteUrl(e.target.value)}
                  placeholder="https://t2mobile.ng"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={pIsActive}
                    onChange={(e) => setPIsActive(e.target.checked)}
                    className="rounded border-slate-800 text-cyan-500"
                  />
                  <span>Active & Visible on Landing Page</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPartnerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold cursor-pointer"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
