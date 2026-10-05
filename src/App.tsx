import React, { useEffect, useState } from 'react';
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
import { StoreTeaser } from './components/StoreTeaser';
import { BlogTeaser } from './components/BlogTeaser';
import { StorePage } from './pages/StorePage';
import { BlogPage } from './pages/BlogPage';
import { VendorPage } from './pages/VendorPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthModal } from './components/AuthModal';
import { VendorModal } from './components/VendorModal';
import { StoreModal } from './components/StoreModal';
import { BlogModal } from './components/BlogModal';
import { PriceListModal } from './components/PriceListModal';
import { LegalModal } from './components/LegalModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataPlan, ServiceItem, StoreProduct, BlogPost } from './types';
import { isWhitelistedSection } from './utils/security';

type PublicPage = 'home' | 'store' | 'blog' | 'vendor';

const AppShell: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PublicPage>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/store') || hash === '#store') return 'store';
    if (path.includes('/blog') || hash === '#blog') return 'blog';
    if (path.includes('/vendor') || hash === '#vendor') return 'vendor';
    return 'home';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | undefined>();
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);
  const [priceListModalOpen, setPriceListModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy'>('terms');

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/dashboard' || path.startsWith('/dashboard/')) return;
      if (path.includes('/store') || hash === '#store') setCurrentPage('store');
      else if (path.includes('/blog') || hash === '#blog') setCurrentPage('blog');
      else if (path.includes('/vendor') || hash === '#vendor') setCurrentPage('vendor');
      else setCurrentPage('home');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!loading && window.location.pathname === '/dashboard' && !user) {
      setAuthTab('login');
      setAuthModalOpen(true);
    }
  }, [loading, user]);

  const handleNavigate = (page: PublicPage, hash?: string) => {
    setCurrentPage(page);
    const url = page === 'home' ? (hash ? `/#${hash}` : '/') : `/${page}`;
    window.history.pushState({ page }, '', url);
    if (page === 'home' && hash) {
      setTimeout(() => {
        if (isWhitelistedSection(hash)) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  const goToDashboard = () => {
    setAuthModalOpen(false);
    window.history.pushState({ page: 'dashboard' }, '', '/dashboard');
    window.scrollTo({ top: 0 });
  };

  const handleSelectService = (_service: ServiceItem) => handleNavigate('home', 'pricing');
  const handleSelectPlan = (_plan: DataPlan) => openAuth('register');
  const handleOpenStore = (product?: StoreProduct) => {
    setSelectedProduct(product);
    setStoreModalOpen(true);
  };
  const handleReadBlog = (post: BlogPost) => {
    setActiveBlogPost(post);
    setBlogModalOpen(true);
  };

  const isDashboardPath = window.location.pathname === '/dashboard' || window.location.pathname.startsWith('/dashboard/');

  if (isDashboardPath && user) {
    return <DashboardPage onExit={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 lg:pb-0">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} onOpenAuth={openAuth} onOpenVendorModal={() => setVendorModalOpen(true)} />
      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-200">
            <HeroSection onOpenAuth={openAuth} onExplorePricing={() => handleNavigate('home', 'pricing')} />
            <ServicesSection onSelectService={handleSelectService} />
            <PricingSection onSelectPlan={handleSelectPlan} onOpenPriceList={() => setPriceListModalOpen(true)} onOpenAuth={openAuth} />
            <VendorSection onOpenVendorModal={() => setVendorModalOpen(true)} onGoToVendorPage={() => handleNavigate('vendor')} />
            <StoreTeaser onGoToStore={() => handleNavigate('store')} />
            <AppDownloadSection />
            <BlogTeaser onGoToBlog={() => handleNavigate('blog')} onReadPost={handleReadBlog} />
            <AboutSection />
            <FaqSection />
          </div>
        )}
        {currentPage === 'vendor' && <VendorPage onBackToHome={() => handleNavigate('home')} onOpenVendorModal={() => setVendorModalOpen(true)} onOpenAuth={openAuth} />}
        {currentPage === 'store' && <StorePage onBackToHome={() => handleNavigate('home')} onOpenStoreModal={handleOpenStore} onOpenAuth={openAuth} />}
        {currentPage === 'blog' && <BlogPage onBackToHome={() => handleNavigate('home')} onReadPost={handleReadBlog} />}
      </main>
      <Footer onOpenLegal={(type) => { setLegalType(type); setLegalModalOpen(true); }} onOpenAuth={openAuth} onOpenVendor={() => setVendorModalOpen(true)} onNavigate={handleNavigate} />
      <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigate} onOpenAuth={openAuth} />
      <AuthModal isOpen={authModalOpen} initialTab={authTab} onClose={() => setAuthModalOpen(false)} onAuthenticated={goToDashboard} />
      <VendorModal isOpen={vendorModalOpen} onClose={() => setVendorModalOpen(false)} />
      <StoreModal isOpen={storeModalOpen} selectedProduct={selectedProduct} onClose={() => setStoreModalOpen(false)} />
      <BlogModal isOpen={blogModalOpen} post={activeBlogPost} onClose={() => setBlogModalOpen(false)} />
      <PriceListModal isOpen={priceListModalOpen} onClose={() => setPriceListModalOpen(false)} onSelectPlan={handleSelectPlan} />
      <LegalModal isOpen={legalModalOpen} type={legalType} onClose={() => setLegalModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return <AuthProvider><AppShell /></AuthProvider>;
}
