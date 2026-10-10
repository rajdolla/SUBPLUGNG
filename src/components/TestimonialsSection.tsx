/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Quote, Sparkles, UserCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const TestimonialsSection: React.FC = () => {
  const { cms } = useCms();
  const socialProof = cms.socialProof;

  if (!socialProof.isVisible) return null;

  const items = (socialProof.items || [])
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{socialProof.badgeText || 'TRUSTED COMMUNITY REVIEWS'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {socialProof.title || 'Loved by Vendors, Retailers & Everyday Users'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed [text-wrap:balance]">
            {socialProof.subtitle || 'Here is what Nigerian students, business owners, and agency banking operators say about SUBPLUG.'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative group"
            >
              <div className="space-y-4">
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-slate-700 group-hover:text-cyan-400/40 transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shrink-0">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                    <span>{testimonial.author}</span>
                    <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {testimonial.role} {testimonial.location ? `· ${testimonial.location}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
