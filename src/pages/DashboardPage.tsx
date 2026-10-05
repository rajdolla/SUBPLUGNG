import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Cable,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Code2,
  CreditCard,
  FileText,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Phone,
  ReceiptText,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  UserRound,
  Users,
  Wallet,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type DashboardSection =
  | 'overview'
  | 'data'
  | 'airtime'
  | 'electricity'
  | 'cable'
  | 'airtime-cash'
  | 'exam-pins'
  | 'recharge'
  | 'reseller'
  | 'api'
  | 'store'
  | 'transactions'
  | 'notifications'
  | 'profile'
  | 'security';

type DashboardPageProps = {
  onExit: () => void;
};

const money = (value: number) => `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

const menuGroups = [
  {
    title: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'transactions', label: 'Transactions', icon: Activity },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    title: 'Buy & Pay',
    items: [
      { id: 'data', label: 'Buy Data', icon: Wifi },
      { id: 'airtime', label: 'Buy Airtime', icon: Smartphone },
      { id: 'electricity', label: 'Electricity', icon: Zap },
      { id: 'cable', label: 'Cable TV', icon: Cable },
      { id: 'airtime-cash', label: 'Airtime to Cash', icon: ArrowLeftRight },
      { id: 'exam-pins', label: 'Exam Pins', icon: GraduationCap },
      { id: 'recharge', label: 'Recharge Printing', icon: ReceiptText },
    ],
  },
  {
    title: 'Grow',
    items: [
      { id: 'reseller', label: 'Reseller Centre', icon: Users },
      { id: 'api', label: 'Developer API', icon: Code2 },
      { id: 'store', label: 'SUBPLUG Store', icon: ShoppingBag },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'Profile', icon: UserRound },
      { id: 'security', label: 'Security', icon: ShieldCheck },
    ],
  },
] as const;

const transactions = [
  { type: 'Data', description: 'MTN 5GB SME', amount: -1300, status: 'Successful', date: 'Today, 10:42 AM' },
  { type: 'Wallet', description: 'Wallet funding', amount: 10000, status: 'Successful', date: 'Yesterday, 4:18 PM' },
  { type: 'Airtime', description: 'Airtel airtime', amount: -2500, status: 'Successful', date: 'Sep 28, 8:31 PM' },
  { type: 'Cable', description: 'DStv Compact', amount: -15700, status: 'Successful', date: 'Sep 26, 1:07 PM' },
];

const serviceCards = [
  { id: 'data', title: 'Buy Data', description: 'MTN, Airtel, Glo & 9mobile bundles', icon: Wifi, tone: 'emerald' },
  { id: 'airtime', title: 'Buy Airtime', description: 'Instant airtime top-up', icon: Smartphone, tone: 'cyan' },
  { id: 'electricity', title: 'Electricity', description: 'Pay prepaid & postpaid bills', icon: Zap, tone: 'amber' },
  { id: 'cable', title: 'Cable TV', description: 'DStv, GOtv & StarTimes', icon: Cable, tone: 'violet' },
  { id: 'airtime-cash', title: 'Airtime to Cash', description: 'Convert airtime to bank funds', icon: ArrowLeftRight, tone: 'rose' },
  { id: 'exam-pins', title: 'Exam Pins', description: 'WAEC, NECO & NABTEB', icon: GraduationCap, tone: 'blue' },
];

const toneClasses: Record<string, string> = {
  emerald: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  cyan: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  amber: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  violet: 'bg-violet-400/10 text-violet-300 border-violet-400/20',
  rose: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
  blue: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onExit }) => {
  const { user, loading, configured, signOut } = useAuth();
  const [section, setSection] = useState<DashboardSection>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  const displayName = useMemo(() => {
    const name = user?.user_metadata?.full_name;
    return typeof name === 'string' && name.trim()
      ? name.trim().split(' ')[0]
      : user?.email?.split('@')[0] || 'Customer';
  }, [user]);

  const go = (next: DashboardSection) => {
    setSection(next);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onExit();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          <p className="mt-4 text-sm text-slate-400">Checking your secure session…</p>
        </div>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-3xl border border-amber-400/20 bg-slate-900 p-8 shadow-2xl">
          <ShieldCheck className="h-10 w-10 text-amber-300" />
          <h1 className="mt-5 text-2xl font-bold">Authentication setup required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The dashboard is intentionally locked until SUBPLUG is connected to a real authentication provider.
            Add the Supabase environment variables from <code className="text-emerald-300">.env.example</code> in Netlify or your local environment.
          </p>
          <button onClick={onExit} className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950">
            Return to SUBPLUG
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <LockIcon />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Dashboard access is protected</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Please sign in to access your wallet, purchases, reseller tools, API area and account settings.
          </p>
          <button onClick={onExit} className="mt-6 w-full rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950">
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-800 bg-slate-950/98 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-full flex-col">
            <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
              <button onClick={onExit} className="flex items-center gap-3" aria-label="Return to SUBPLUG">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                  S
                </div>
                <div className="text-left">
                  <div className="font-black tracking-tight">SUBPLUG</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Customer Portal</div>
                </div>
              </button>
              <button className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-900" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5">
              {menuGroups.map((group) => (
                <div key={group.title} className="mb-6">
                  <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">{group.title}</div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = section === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => go(item.id)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                        >
                          <Icon className="h-4.5 w-4.5 shrink-0" />
                          <span>{item.label}</span>
                          {item.id === 'notifications' && <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 p-3">
              <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {mobileOpen && <button className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-800 p-2.5 text-slate-300 lg:hidden" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <div className="text-xs text-slate-500">Secure customer portal</div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">
                    {section === 'overview' ? `Good day, ${displayName}` : menuGroups.flatMap((g) => g.items).find((i) => i.id === section)?.label}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={() => go('notifications')} className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-slate-300 hover:text-white" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </button>
                <button onClick={() => go('profile')} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-2.5 py-2 hover:border-slate-700">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 text-xs font-black text-slate-950">{displayName.charAt(0).toUpperCase()}</div>
                  <span className="hidden sm:block text-sm font-semibold text-slate-200">{displayName}</span>
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
            {section === 'overview' && (
              <Overview displayName={displayName} onFund={() => setShowFundModal(true)} onNavigate={go} />
            )}
            {section === 'transactions' && <Transactions />}
            {section === 'notifications' && <Notifications />}
            {['data', 'airtime', 'electricity', 'cable', 'airtime-cash', 'exam-pins', 'recharge'].includes(section) && (
              <ServiceWorkspace section={section} />
            )}
            {section === 'reseller' && <ResellerWorkspace onNavigate={go} />}
            {section === 'api' && <ApiWorkspace />}
            {section === 'store' && <StoreWorkspace />}
            {section === 'profile' && <ProfileWorkspace user={user} />}
            {section === 'security' && <SecurityWorkspace user={user} />}
          </div>
        </main>
      </div>

      {showFundModal && <FundWalletModal onClose={() => setShowFundModal(false)} />}
    </div>
  );
};

const LockIcon = () => <ShieldCheck className="h-7 w-7" />;

const Overview: React.FC<{
  displayName: string;
  onFund: () => void;
  onNavigate: (section: DashboardSection) => void;
}> = ({ displayName, onFund, onNavigate }) => (
  <div className="space-y-6">
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            <ShieldCheck className="h-4 w-4" /> Protected workspace
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            One dashboard for every SUBPLUG service.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Buy telecom bundles, settle bills, manage your reseller business, access the developer API and track every transaction from one secure workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onFund} className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/10">Fund wallet</button>
          <button onClick={() => onNavigate('transactions')} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white">View transactions</button>
        </div>
      </div>
    </section>

    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={Wallet} label="Available balance" value={money(0)} note="Connect wallet ledger" />
      <StatCard icon={ArrowDownToLine} label="Total funded" value={money(0)} note="Live after wallet backend" />
      <StatCard icon={CircleDollarSign} label="Total spent" value={money(0)} note="Live after transactions backend" />
      <StatCard icon={Users} label="Referral earnings" value={money(0)} note="Available after referral setup" />
    </section>

    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Quick services</h3>
          <p className="text-sm text-slate-500">Everything you can manage from your account.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {serviceCards.map((service) => {
          const Icon = service.icon;
          return (
            <button key={service.id} onClick={() => onNavigate(service.id as DashboardSection)} className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${toneClasses[service.tone]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-bold text-white">{service.title}</div>
              <div className="mt-1 text-[11px] leading-5 text-slate-500">{service.description}</div>
              <ChevronRight className="mt-3 h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
            </button>
          );
        })}
      </div>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">Recent activity</h3>
            <p className="text-xs text-slate-500">Your latest account events.</p>
          </div>
          <button onClick={() => onNavigate('transactions')} className="text-xs font-bold text-emerald-300">View all</button>
        </div>
        <div className="mt-5 divide-y divide-slate-800/80">
          {transactions.map((item) => (
            <div key={item.description} className="flex items-center gap-3 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                {item.type === 'Data' ? <Wifi className="h-4 w-4" /> : item.type === 'Wallet' ? <Wallet className="h-4 w-4" /> : item.type === 'Cable' ? <Cable className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{item.description}</div>
                <div className="text-xs text-slate-500">{item.date}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${item.amount > 0 ? 'text-emerald-300' : 'text-slate-200'}`}>{item.amount > 0 ? '+' : ''}{money(Math.abs(item.amount))}</div>
                <div className="text-[10px] text-emerald-400">{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/10 to-cyan-400/5 p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-slate-950"><Users className="h-5 w-5" /></div>
        <h3 className="mt-5 text-xl font-black text-white">Grow with SUBPLUG</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">Unlock wholesale rates, reseller tools and API access when you upgrade your account.</p>
        <button onClick={() => onNavigate('reseller')} className="mt-6 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950">Explore reseller tools <ArrowUpRight className="h-4 w-4" /></button>
      </div>
    </section>
  </div>
);

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string; note: string }> = ({ icon: Icon, label, value, note }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-300"><Icon className="h-5 w-5" /></div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Account</span>
    </div>
    <div className="mt-5 text-2xl font-black text-white">{value}</div>
    <div className="mt-1 text-xs font-semibold text-slate-400">{label}</div>
    <div className="mt-2 text-[10px] text-slate-600">{note}</div>
  </div>
);

const ServiceWorkspace: React.FC<{ section: Exclude<DashboardSection, 'overview'|'transactions'|'notifications'|'reseller'|'api'|'store'|'profile'|'security'> }> = ({ section }) => {
  const config = {
    data: { title: 'Buy Data', subtitle: 'Choose a network bundle and deliver it instantly to a Nigerian phone number.', icon: Wifi, fields: ['Network', 'Phone number', 'Data plan'] },
    airtime: { title: 'Buy Airtime', subtitle: 'Top up any supported Nigerian network in seconds.', icon: Smartphone, fields: ['Network', 'Phone number', 'Amount'] },
    electricity: { title: 'Pay Electricity', subtitle: 'Pay prepaid or postpaid electricity bills with meter validation.', icon: Zap, fields: ['DisCo', 'Meter number', 'Amount'] },
    cable: { title: 'Cable TV', subtitle: 'Manage DStv, GOtv and StarTimes subscriptions.', icon: Cable, fields: ['Provider', 'Smartcard / IUC', 'Bouquet'] },
    'airtime-cash': { title: 'Airtime to Cash', subtitle: 'Start a verified airtime conversion request and track its status.', icon: ArrowLeftRight, fields: ['Network', 'Phone number', 'Amount'] },
    'exam-pins': { title: 'Exam Pins', subtitle: 'Purchase official result-checking pins when the service is connected.', icon: GraduationCap, fields: ['Exam body', 'Quantity', 'Email / phone'] },
    recharge: { title: 'Recharge Card Printing', subtitle: 'Generate and manage printable recharge e-pins for your customers.', icon: ReceiptText, fields: ['Network', 'Quantity', 'Value per PIN'] },
  }[section];

  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><Icon className="h-6 w-6" /></div>
        <h2 className="mt-5 text-3xl font-black text-white">{config.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{config.subtitle}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300"><RefreshCw className="h-4 w-4" /> Secure checkout pipeline</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {config.fields.map((field) => (
              <label key={field} className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">{field}</span>
                <input disabled placeholder={field} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-500 outline-none" />
              </label>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs leading-5 text-slate-500">
            Live transactions are intentionally disabled in this frontend until the SUBPLUG backend / VTU provider endpoints are connected. This prevents users from submitting fake or client-side-only payments.
          </div>
          <button disabled className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-500">Connect secure payment backend</button>
        </div>
        <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/5 p-6">
          <ShieldCheck className="h-6 w-6 text-emerald-300" />
          <h3 className="mt-4 font-bold text-white">Protected by authentication</h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">Only an authenticated SUBPLUG user can reach this workspace. Final purchase authorization must also be enforced by the backend using the authenticated user's JWT and server-side validation.</p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => (
  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7">
    <div className="flex items-center justify-between">
      <div><h2 className="text-2xl font-black text-white">Transactions</h2><p className="mt-1 text-sm text-slate-500">Your authenticated transaction history.</p></div>
      <FileText className="h-6 w-6 text-slate-500" />
    </div>
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-600"><tr><th className="pb-3">Service</th><th className="pb-3">Description</th><th className="pb-3">Amount</th><th className="pb-3">Status</th><th className="pb-3">Date</th></tr></thead>
        <tbody className="divide-y divide-slate-800/70">{transactions.map((t) => <tr key={t.description}><td className="py-4 text-slate-300">{t.type}</td><td className="py-4 font-semibold text-white">{t.description}</td><td className={`py-4 font-bold ${t.amount > 0 ? 'text-emerald-300' : 'text-slate-200'}`}>{t.amount > 0 ? '+' : '-'}{money(Math.abs(t.amount))}</td><td className="py-4"><span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300"><CheckCircle2 className="h-3 w-3" />{t.status}</span></td><td className="py-4 text-slate-500">{t.date}</td></tr>)}</tbody>
      </table>
    </div>
  </div>
);

const Notifications = () => (
  <div className="space-y-4">
    {[
      ['Security alert', 'Your authenticated dashboard session is active. Keep your password private.', ShieldCheck],
      ['Wallet', 'Wallet funding and live transaction notifications will appear here after backend integration.', Wallet],
      ['Reseller', 'Upgrade your account to unlock wholesale and API features.', Users],
    ].map(([title, text, Icon]) => (
      <div key={String(title)} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-emerald-300"><Icon className="h-5 w-5" /></div>
        <div><div className="font-bold text-white">{String(title)}</div><p className="mt-1 text-sm leading-6 text-slate-500">{String(text)}</p></div>
      </div>
    ))}
  </div>
);

const ResellerWorkspace: React.FC<{ onNavigate: (section: DashboardSection) => void }> = ({ onNavigate }) => (
  <div className="space-y-6">
    <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-slate-900 to-slate-950 p-6 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300"><Users className="h-6 w-6" /></div>
      <h2 className="mt-5 text-3xl font-black text-white">Reseller Centre</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Manage your reseller upgrade, wholesale rates, referral earnings and API access from one place.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metric label="Tier" value="Customer" />
        <Metric label="Monthly profit" value="₦0.00" />
        <Metric label="Referral balance" value="₦0.00" />
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ['Upgrade to reseller', 'Unlock wholesale pricing and reseller tools.', TrendingIcon],
        ['Referral programme', 'Invite customers and track eligible rewards.', Users],
        ['API partner', 'Build your own VTU-powered app or platform.', Code2],
      ].map(([title, text, Icon]) => (
        <div key={String(title)} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <Icon className="h-5 w-5 text-emerald-300" />
          <h3 className="mt-4 font-bold text-white">{String(title)}</h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">{String(text)}</p>
          <button onClick={() => String(title).includes('API') ? onNavigate('api') : undefined} className="mt-5 text-xs font-bold text-emerald-300">Explore →</button>
        </div>
      ))}
    </div>
  </div>
);

const TrendingIcon = () => <ArrowUpRight className="h-5 w-5" />;

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className="mt-2 text-lg font-black text-white">{value}</div></div>
);

const ApiWorkspace = () => (
  <div className="space-y-6">
    <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-slate-950 p-6 sm:p-8">
      <Code2 className="h-7 w-7 text-cyan-300" />
      <h2 className="mt-5 text-3xl font-black text-white">Developer API</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">A protected workspace for API onboarding, documentation and credential management. Secrets should be generated and rotated by the backend—not hard-coded in this frontend.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300">REST API</span>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300">Webhooks</span>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300">Idempotency</span>
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><h3 className="font-bold text-white">API credentials</h3><p className="mt-2 text-sm text-slate-500">No live secret is displayed in the browser UI. Credential generation should be handled by a protected server endpoint.</p><button disabled className="mt-5 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-500">Generate credential</button></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><h3 className="font-bold text-white">Documentation</h3><p className="mt-2 text-sm text-slate-500">Connect the production API docs here when the backend contract is finalized.</p><button disabled className="mt-5 rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-500">Open API docs</button></div>
    </div>
  </div>
);

const StoreWorkspace = () => (
  <div className="space-y-6">
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8">
      <ShoppingBag className="h-7 w-7 text-emerald-300" />
      <h2 className="mt-5 text-3xl font-black text-white">SUBPLUG Store</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Manage POS terminals, MiFi devices, thermal printers and other products from your authenticated account.</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        ['POS Terminal', '₦38,500', 'Hardware'],
        ['4G Pocket WiFi', '₦18,500', 'Connectivity'],
        ['58mm Thermal Printer', '₦16,000', 'Hardware'],
      ].map(([name, price, category]) => (
        <div key={name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-emerald-300"><Package className="h-5 w-5" /></div>
          <div className="mt-4 text-xs text-slate-500">{category}</div>
          <h3 className="mt-1 font-bold text-white">{name}</h3>
          <div className="mt-3 text-lg font-black text-emerald-300">{price}</div>
          <button disabled className="mt-5 w-full rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold text-slate-500">Checkout after store backend</button>
        </div>
      ))}
    </div>
  </div>
);

const ProfileWorkspace: React.FC<{ user: NonNullable<ReturnType<typeof useAuth>['user']> }> = ({ user }) => (
  <div className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
    <UserRound className="h-7 w-7 text-emerald-300" />
    <h2 className="mt-5 text-2xl font-black text-white">Profile</h2>
    <div className="mt-6 space-y-4">
      <ReadOnlyField label="Email" value={user.email || '—'} />
      <ReadOnlyField label="Full name" value={String(user.user_metadata?.full_name || '—')} />
      <ReadOnlyField label="Phone" value={String(user.user_metadata?.phone || '—')} />
      <ReadOnlyField label="User ID" value={user.id} mono />
    </div>
  </div>
);

const ReadOnlyField: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div><div className="mb-2 text-xs font-semibold text-slate-400">{label}</div><div className={`rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 ${mono ? 'font-mono text-xs' : ''}`}>{value}</div></div>
);

const SecurityWorkspace: React.FC<{ user: NonNullable<ReturnType<typeof useAuth>['user']> }> = ({ user }) => (
  <div className="max-w-3xl space-y-4">
    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6 sm:p-8">
      <ShieldCheck className="h-7 w-7 text-emerald-300" />
      <h2 className="mt-5 text-2xl font-black text-white">Account security</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Authentication is handled by Supabase Auth. Do not store passwords, service-role keys, payment secrets or VTU provider credentials in this React app.</p>
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-slate-950/40 p-4"><CheckCircle2 className="h-5 w-5 text-emerald-300" /><div><div className="text-sm font-bold text-white">Authenticated session active</div><div className="text-xs text-slate-500">{user.email}</div></div></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <SecurityCard icon={LockIcon} title="Password" text="Change password through the authenticated provider flow." />
      <SecurityCard icon={ShieldCheck} title="MFA" text="Enable TOTP / stronger authentication before enabling high-risk wallet actions." />
    </div>
  </div>
);

const SecurityCard: React.FC<{ icon: React.ElementType; title: string; text: string }> = ({ icon: Icon, title, text }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><Icon className="h-5 w-5 text-emerald-300" /><h3 className="mt-4 font-bold text-white">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>
);

const FundWalletModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-black text-white">Fund wallet</h2><p className="mt-1 text-xs text-slate-500">Secure funding options will appear here.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800" aria-label="Close"><X className="h-5 w-5" /></button></div>
      <div className="mt-6 space-y-3">
        {[['Dedicated bank transfer', Wallet], ['Card / USSD', CreditCard]].map(([label, Icon]) => <button key={String(label)} disabled className="flex w-full items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left opacity-60"><Icon className="h-5 w-5 text-emerald-300" /><div><div className="text-sm font-bold text-white">{String(label)}</div><div className="text-xs text-slate-500">Available after wallet backend is connected</div></div></button>)}
      </div>
      <div className="mt-5 rounded-2xl bg-amber-400/5 p-4 text-xs leading-5 text-slate-500">Payment credentials and wallet mutations must be verified server-side. This UI does not collect card numbers.</div>
    </div>
  </div>
);
