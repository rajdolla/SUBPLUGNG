import React from 'react';
import { 
  Wifi, 
  PhoneCall, 
  Zap, 
  Tv, 
  GraduationCap, 
  ArrowLeftRight, 
  Printer, 
  Code2, 
  ArrowUpRight 
} from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES_LIST } from '../data/mockData';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wifi':
        return <Wifi className="h-6 w-6 text-emerald-400" />;
      case 'PhoneCall':
        return <PhoneCall className="h-6 w-6 text-blue-400" />;
      case 'Zap':
        return <Zap className="h-6 w-6 text-amber-400" />;
      case 'Tv':
        return <Tv className="h-6 w-6 text-purple-400" />;
      case 'GraduationCap':
        return <GraduationCap className="h-6 w-6 text-teal-400" />;
      case 'ArrowLeftRight':
        return <ArrowLeftRight className="h-6 w-6 text-rose-400" />;
      case 'Printer':
        return <Printer className="h-6 w-6 text-cyan-400" />;
      case 'Code2':
        return <Code2 className="h-6 w-6 text-emerald-400" />;
      default:
        return <Zap className="h-6 w-6 text-emerald-400" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            Comprehensive VTU Gateway
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Everything You Need to Connect, Pay & Earn
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            Enjoy instant processing on all major Nigerian telecommunication networks, power distribution companies, and educational boards.
          </p>
        </div>

        {/* Services Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {SERVICES_LIST.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group relative flex flex-col justify-between p-4 sm:p-6 bg-slate-900/90 hover:bg-slate-800/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-emerald-500/5 active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/60 group-hover:border-emerald-500/40 group-hover:scale-105 transition-all">
                    {getIcon(service.icon)}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-emerald-400 flex items-center gap-0.5">
                    View Rates <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {service.title}
                </h3>
                
                <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                  {service.subtitle}
                </p>
              </div>

              {/* Unboxed category badge per anti-slop */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-500">
                <span className="capitalize">{service.category}</span>
                {service.badge && (
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {service.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Telco Partners Indicator */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs sm:text-sm font-semibold">
          <span className="text-slate-500 uppercase tracking-wider text-[11px]">Supported Networks:</span>
          <span className="text-yellow-400 font-bold tracking-tight">MTN Nigeria</span>
          <span className="text-red-400 font-bold tracking-tight">Airtel Nigeria</span>
          <span className="text-emerald-400 font-bold tracking-tight">Globacom (Glo)</span>
          <span className="text-lime-400 font-bold tracking-tight">9mobile</span>
        </div>

      </div>
    </section>
  );
};
