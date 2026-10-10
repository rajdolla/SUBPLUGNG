/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  XCircle,
  Upload,
  Link,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  AlertCircle,
  X,
} from 'lucide-react';
import { usePartners } from '../../context/PartnersContext';
import { PartnerItem } from '../../types/cms';

export const AdminPartnersWorkspace: React.FC = () => {
  const {
    partners,
    activePartners,
    addPartner,
    updatePartner,
    deletePartner,
    togglePartnerActive,
    reorderPartners,
    resetToDefaults,
  } = usePartners();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingPartner(null);
    setName('');
    setLogoUrl('');
    setAltText('');
    setWebsiteUrl('');
    setDisplayOrder(partners.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (partner: PartnerItem) => {
    setEditingPartner(partner);
    setName(partner.name);
    setLogoUrl(partner.logoUrl);
    setAltText(partner.altText);
    setWebsiteUrl(partner.websiteUrl || '');
    setDisplayOrder(partner.displayOrder);
    setIsActive(partner.isActive);
    setIsModalOpen(true);
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
        setLogoUrl(result);
        if (!altText && name) {
          setAltText(`${name} Official Partner`);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalAlt = altText.trim() || `${name.trim()} Official Partner`;

    if (editingPartner) {
      updatePartner(editingPartner.id, {
        name: name.trim(),
        logoUrl: logoUrl.trim() || editingPartner.logoUrl,
        altText: finalAlt,
        websiteUrl: websiteUrl.trim() || undefined,
        displayOrder: Number(displayOrder) || editingPartner.displayOrder,
        isActive,
      });
      setStatusNotice(`Updated partner "${name.trim()}". Changes are live in this session.`);
    } else {
      addPartner({
        name: name.trim(),
        logoUrl: logoUrl.trim() || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><rect width="200" height="80" fill="%23f1f5f9"/><text x="100" y="45" font-family="Arial" font-size="18" text-anchor="middle" fill="%23475569">' + encodeURIComponent(name.trim()) + '</text></svg>',
        altText: finalAlt,
        websiteUrl: websiteUrl.trim() || undefined,
        displayOrder: Number(displayOrder) || partners.length + 1,
        isActive,
      });
      setStatusNotice(`Added new partner "${name.trim()}". Changes are live in this session.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setStatusNotice(null), 6000);
  };

  const sortedPartners = [...partners].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wide">
            <Globe className="h-3.5 w-3.5" />
            <span>LANDING PAGE CMS · OUR PARTNERS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Our Partners Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage telecommunications and broadband carrier logos shown in the high-profile white container on the SUBPLUG landing page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="h-4 w-4 text-cyan-400" />
            <span>{showLivePreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Partner</span>
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-start gap-3">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">CMS Architecture Ready (Frontend State)</div>
          <p className="text-slate-300 leading-relaxed">
            All additions, logo replacements, reordering, and toggle actions update the live landing page in real-time for your active session. Permanent cloud synchronization will connect when the Supabase Storage bucket and partner table are provisioned.
          </p>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* 2. Interactive Live Landing Page Container Preview */}
      {showLivePreview && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Real-Time Landing Page Viewport Preview</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {activePartners.length} of {partners.length} partners active
            </span>
          </div>

          <div className="relative rounded-3xl bg-white border border-cyan-400/25 shadow-xl p-6 sm:p-8 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400" />
            
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                OUR PARTNERS (LANDING PREVIEW)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 items-center justify-items-center gap-4 sm:gap-6">
              {activePartners.map((partner) => (
                <div
                  key={partner.id}
                  className="w-full h-16 sm:h-20 flex items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-all group"
                  title={partner.altText}
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.altText}
                    className="max-h-10 sm:max-h-12 max-w-[120px] w-auto h-auto object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {activePartners.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No active partners to display. Toggle partners below to activate them on the landing page.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Partner Management Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Configured Partners & Logos ({partners.length})
            </h2>
            <p className="text-xs text-slate-400">
              Reorder display sequence, edit metadata, replace branding, or toggle visibility
            </p>
          </div>

          <button
            onClick={resetToDefaults}
            className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Initial 6 Partners</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-3">Order</th>
                <th className="py-3 px-3">Logo Preview</th>
                <th className="py-3 px-3">Partner Name</th>
                <th className="py-3 px-3">Alt Text</th>
                <th className="py-3 px-3">Website</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sortedPartners.map((partner, index) => (
                <tr key={partner.id} className="hover:bg-slate-950/40 transition-colors">
                  {/* Order & Reordering buttons */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-white w-5 text-center">
                        {partner.displayOrder}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => reorderPartners(partner.id, 'up')}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === sortedPartners.length - 1}
                          onClick={() => reorderPartners(partner.id, 'down')}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Logo Preview inside miniature white box */}
                  <td className="py-3 px-3">
                    <div className="h-10 w-20 rounded-lg bg-white p-1 flex items-center justify-center border border-slate-200">
                      <img
                        src={partner.logoUrl}
                        alt={partner.altText}
                        className="max-h-8 max-w-[70px] object-contain"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                    {partner.name}
                  </td>

                  {/* Alt Text */}
                  <td className="py-3 px-3 text-slate-400 max-w-[200px] truncate" title={partner.altText}>
                    {partner.altText}
                  </td>

                  {/* Website */}
                  <td className="py-3 px-3 text-slate-400">
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => togglePartnerActive(partner.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        partner.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      {partner.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      <span>{partner.isActive ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(partner)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                        title="Edit Partner"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove partner "${partner.name}"?`)) {
                            deletePartner(partner.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Partner"
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

      {/* 4. Add / Edit Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold mb-2">
                <Globe className="h-3.5 w-3.5" />
                <span>{editingPartner ? 'EDIT PARTNER' : 'ADD NEW PARTNER'}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {editingPartner ? `Edit ${editingPartner.name}` : 'Add Carrier Partner'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure brand details and logo presentation for the landing page.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Partner Name */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Partner / Network Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MTN Nigeria, Smile Communications"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!altText) setAltText(`${e.target.value} Official Partner`);
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Logo Preview & Upload */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-300">
                  Partner Brand Logo
                </label>
                
                {logoUrl && (
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-center h-20">
                    <img src={logoUrl} alt="Logo preview" className="max-h-14 max-w-[160px] object-contain" />
                  </div>
                )}

                <div className="flex gap-2">
                  <label className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700">
                    <Upload className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Upload Logo File (PNG / SVG / JPG)</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold cursor-pointer"
                    >
                      Clear Logo
                    </button>
                  )}
                </div>
              </div>

              {/* Alt Text (Accessibility Requirement) */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Accessible Image Alt Text *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MTN Nigeria Official Network Partner"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Ensures accessibility for screen readers and SEO indexing.
                </span>
              </div>

              {/* Website URL */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Official Website URL <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.mtn.ng"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Display Order (1–20)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Landing Page Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    <span>{isActive ? 'Active on Page' : 'Disabled'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  {editingPartner ? 'Save Changes' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
