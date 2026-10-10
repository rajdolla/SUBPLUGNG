/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCms } from '../context/CmsContext';
import { ShieldCheck } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  const { cms, activePartners } = useCms();
  const sectionMeta = cms.partnersSection;

  if (sectionMeta && !sectionMeta.isVisible) return null;

  return (
    <section id="partners" className="relative py-14 sm:py-20 bg-slate-950 overflow-hidden">
      {/* Background ambient glow matching SUBPLUG theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-72 bg-gradient-to-r from-emerald-500/5 via-cyan-500/10 to-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>{sectionMeta?.badgeText || 'DIRECT NETWORK INTERCONNECT'}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase">
            {sectionMeta?.title || 'OUR PARTNERS'}
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed [text-wrap:balance]">
            {sectionMeta?.subtitle || 'Direct telecom switches and high-speed API gateways with Nigeria’s leading licensed cellular and 4G LTE broadband operators.'}
          </p>
        </div>

        {/* The White / Light Partner Container (Visual Reference Direction) */}
        <div className="relative rounded-3xl bg-white border border-cyan-400/25 shadow-[0_12px_45px_rgba(0,229,255,0.08)] p-6 sm:p-10 lg:p-12 overflow-hidden">
          
          {/* Subtle top cyan/teal accent indicator line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 opacity-90" />

          {/* Partner Logos Grid:
              Desktop (lg): 6 columns in 1 horizontal row
              Tablet (sm): 3 columns
              Mobile: 2 columns
          */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 items-center justify-items-center gap-6 sm:gap-8 lg:gap-6">
            {activePartners.map((partner) => {
              const content = (
                <div className="w-full h-20 sm:h-24 flex items-center justify-center p-3 sm:p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 group">
                  <img
                    src={partner.logoUrl}
                    alt={partner.altText || `${partner.name} Official Partner`}
                    loading="lazy"
                    className="max-h-12 sm:max-h-14 max-w-[130px] sm:max-w-[145px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              );

              if (partner.websiteUrl) {
                return (
                  <a
                    key={partner.id}
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Visit ${partner.name}`}
                    className="w-full block focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-2xl"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={partner.id} className="w-full">
                  {content}
                </div>
              );
            })}
          </div>

          {/* Subtext info under the light container */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{sectionMeta?.footerNote || 'Carrier-Grade API & Direct USSD Switch Status: 100% Operational'}</span>
            </div>
            <div className="text-slate-400 font-mono text-[10px]">
              MTN · GLO · T2MOBILE · AIRTEL · SMILE · SPECTRANET
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
