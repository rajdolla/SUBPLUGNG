import React, { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-slate-900/40 border-t border-slate-800/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-base text-slate-400">
            Everything you need to know about our VTU automation, wallet funding, and reseller partnerships.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors pr-4">
                    {item.question}
                  </span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-400 bg-emerald-500/10' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more help CTA card */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Still have a question?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Our Nigerian support agents are online 24/7 to assist you.</p>
          </div>
          <a
            href="https://wa.me/2348101234567?text=Hello%20Subplug,%20I%20have%20an%20inquiry%20regarding%20VTU%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
