/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { PricingSection } from './components/PricingSection';
import { VendorSection } from './components/VendorSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

// Teasers on Landing
import { StoreTeaser } from './components/StoreTeaser';
import { BlogTeaser } from './components/BlogTeaser';

// Dedicated Separate Pages
import { StorePage } from './pages/StorePage';
import { BlogPage } from './pages/BlogPage';
import { VendorPage } from './pages/VendorPage';

// Modals
import { AuthModal } from './components/AuthModal';
import { VendorModal } from './components/VendorModal';
import { StoreModal } from './components/StoreModal';
import { BlogModal } from './components/BlogModal';
import { PriceListModal } from './components/PriceListModal';
import { LegalModal } from './components/LegalModal';

import { DataPlan, ServiceItem, StoreProduct, BlogPost } from './types';
import { isWhitelistedSection } from './utils/security';

export default function App() {
  // Page Routing State: 'home' | 'store' | 'blog' | 'vendor'
  const [currentPage, setCurrentPage] = useState<'home' | 'store' | 'blog' | 'vendor'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/store') || hash === '#store') return 'store';
      if (path.includes('/blog') || hash === '#blog') return 'blog';
      if (path.includes('/vendor') || hash === '#vendor') return 'vendor';
    }
    return 'home';
  });

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');

  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | undefined>(undefined);

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);

  const [priceListModalOpen, setPriceListModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy'>('terms');

  // Handle Browser Back/Forward Navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/store') || hash === '#store') {
        setCurrentPage('store');
      } else if (path.includes('/blog') || hash === '#blog') {
        setCurrentPage('blog');
      } else if (path.includes('/vendor') || hash === '#vendor') {
        setCurrentPage('vendor');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Page Navigation Controller
  const handleNavigate = (page: 'home' | 'store' | 'blog' | 'vendor', hash?: string) => {
    setCurrentPage(page);

    try {
      if (page === 'home') {
        const url = hash ? `/#${hash}` : '/';
        window.history.pushState({ page: 'home' }, '', url);
      } else {
        window.history.pushState({ page }, '', `/${page}`);
      }
    } catch {
      // Fallback for sandboxed iframes
    }

    if (page === 'home' && hash) {
      setTimeout(() => {
        if (isWhitelistedSection(hash)) {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Auth & Actions
  const handleOpenAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  const handleSelectService = (_service: ServiceItem) => {
    handleNavigate('home', 'pricing');
  };

  const handleSelectPlan = (_plan: DataPlan) => {
    handleOpenAuth('register');
  };

  const handleOpenStore = (product?: StoreProduct) => {
    setSelectedProduct(product);
    setStoreModalOpen(true);
  };

  const handleReadBlog = (post: BlogPost) => {
    setActiveBlogPost(post);
    setBlogModalOpen(true);
  };

  const handleOpenLegal = (type: 'terms' | 'privacy') => {
    setLegalType(type);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 lg:pb-0">
      {/* Global Header Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onOpenVendorModal={() => setVendorModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-200">
            {/* 1. Hero Section */}
            <HeroSection
              onOpenAuth={handleOpenAuth}
              onExplorePricing={() => handleNavigate('home', 'pricing')}
            />

            {/* 2. Services Section */}
            <ServicesSection
              onSelectService={handleSelectService}
            />

            {/* 3. Pricing Section */}
            <PricingSection
              onSelectPlan={handleSelectPlan}
              onOpenPriceList={() => setPriceListModalOpen(true)}
              onOpenAuth={handleOpenAuth}
            />

            {/* 4. Become a Vendor Section */}
            <VendorSection
              onOpenVendorModal={() => setVendorModalOpen(true)}
              onGoToVendorPage={() => handleNavigate('vendor')}
            />

            {/* 5. Store Preview Teaser (Routes to separate Store Page) */}
            <StoreTeaser
              onGoToStore={() => handleNavigate('store')}
            />

            {/* 6. App Download Section */}
            <AppDownloadSection />

            {/* 7. Blog Preview Teaser (Routes to separate Blog Page) */}
            <BlogTeaser
              onGoToBlog={() => handleNavigate('blog')}
              onReadPost={handleReadBlog}
            />

            {/* 8. About Us Section */}
            <AboutSection />

            {/* 9. FAQ Section */}
            <FaqSection />
          </div>
        )}

        {currentPage === 'vendor' && (
          <div className="animate-in fade-in duration-200">
            <VendorPage
              onBackToHome={() => handleNavigate('home')}
              onOpenVendorModal={() => setVendorModalOpen(true)}
              onOpenAuth={handleOpenAuth}
            />
          </div>
        )}

        {currentPage === 'store' && (
          <div className="animate-in fade-in duration-200">
            <StorePage
              onBackToHome={() => handleNavigate('home')}
              onOpenStoreModal={handleOpenStore}
              onOpenAuth={handleOpenAuth}
            />
          </div>
        )}

        {currentPage === 'blog' && (
          <div className="animate-in fade-in duration-200">
            <BlogPage
              onBackToHome={() => handleNavigate('home')}
              onReadPost={handleReadBlog}
            />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onOpenAuth={handleOpenAuth}
        onOpenVendor={() => setVendorModalOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Floating WhatsApp Live Support Trigger */}
      <aside aria-label="Support contacts" className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30 flex items-center">
        <a
          href="https://wa.me/2348101234567?text=Hello%20Subplug,%20I%20need%20assistance%20with%20VTU%20services"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold rounded-full shadow-2xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 transition-all duration-300 active:scale-95 border-2 border-white/20 cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <div className="relative flex items-center justify-center">
            <svg className="h-6 w-6 fill-slate-950" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.531 1.774.813 2.796.813h.005c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.773-5.766zm3.364 8.163c-.144.405-.837.774-1.17.822-.312.043-.727.069-2.313-.589-2.029-.841-3.328-2.91-3.428-3.045-.1-.136-.826-1.1-1.026-1.371-.2-.271-.4-.606-.4-.939 0-.333.176-.499.239-.567.063-.068.138-.085.184-.085.046 0 .092.001.131.003.043.003.1.009.155.122.062.128.213.518.231.556.019.038.031.083.007.132-.025.048-.038.077-.075.122-.038.044-.08.099-.115.132-.04.038-.082.079-.036.158.046.079.206.338.441.547.302.269.557.352.637.391.079.04.126.034.173-.02.046-.053.2-.232.253-.312.053-.08.106-.067.177-.04.072.026.457.215.535.254.079.04.131.06.15.093.019.033.019.192-.125.597z"/>
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-100 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
          </div>
          <span className="hidden sm:inline text-xs font-black tracking-wide text-slate-950">
            WhatsApp Live Support
          </span>
        </a>
      </aside>

      {/* Mobile-First Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authTab}
        onClose={() => setAuthModalOpen(false)}
      />

      <VendorModal
        isOpen={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
      />

      <StoreModal
        isOpen={storeModalOpen}
        selectedProduct={selectedProduct}
        onClose={() => setStoreModalOpen(false)}
      />

      <BlogModal
        isOpen={blogModalOpen}
        post={activeBlogPost}
        onClose={() => setBlogModalOpen(false)}
      />

      <PriceListModal
        isOpen={priceListModalOpen}
        onClose={() => setPriceListModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />

      <LegalModal
        isOpen={legalModalOpen}
        type={legalType}
        onClose={() => setLegalModalOpen(false)}
      />
    </div>
  );
}
