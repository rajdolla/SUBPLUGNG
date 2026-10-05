import { DataPlan, ServiceItem, StoreProduct, BlogPost, FaqItem } from '../types';

export const DATA_PLANS: DataPlan[] = [
  // MTN
  { id: 'mtn-500mb', network: 'MTN', name: '500MB SME', validity: '30 Days', userPrice: 140, vendorPrice: 125, type: 'SME' },
  { id: 'mtn-1gb', network: 'MTN', name: '1.0GB SME', validity: '30 Days', userPrice: 260, vendorPrice: 240, type: 'SME', popular: true },
  { id: 'mtn-2gb', network: 'MTN', name: '2.0GB SME', validity: '30 Days', userPrice: 520, vendorPrice: 480, type: 'SME' },
  { id: 'mtn-3gb', network: 'MTN', name: '3.0GB SME', validity: '30 Days', userPrice: 780, vendorPrice: 720, type: 'SME' },
  { id: 'mtn-5gb', network: 'MTN', name: '5.0GB SME', validity: '30 Days', userPrice: 1300, vendorPrice: 1200, type: 'SME', popular: true },
  { id: 'mtn-10gb', network: 'MTN', name: '10.0GB SME', validity: '30 Days', userPrice: 2600, vendorPrice: 2400, type: 'SME' },

  // Airtel
  { id: 'airtel-500mb', network: 'Airtel', name: '500MB CG', validity: '30 Days', userPrice: 145, vendorPrice: 130, type: 'Corporate Gifting' },
  { id: 'airtel-1gb', network: 'Airtel', name: '1.0GB CG', validity: '30 Days', userPrice: 270, vendorPrice: 248, type: 'Corporate Gifting', popular: true },
  { id: 'airtel-2gb', network: 'Airtel', name: '2.0GB CG', validity: '30 Days', userPrice: 540, vendorPrice: 495, type: 'Corporate Gifting' },
  { id: 'airtel-5gb', network: 'Airtel', name: '5.0GB CG', validity: '30 Days', userPrice: 1350, vendorPrice: 1240, type: 'Corporate Gifting', popular: true },
  { id: 'airtel-10gb', network: 'Airtel', name: '10.0GB CG', validity: '30 Days', userPrice: 2700, vendorPrice: 2480, type: 'Corporate Gifting' },

  // Glo
  { id: 'glo-1gb', network: 'Glo', name: '1.0GB Corporate', validity: '30 Days', userPrice: 255, vendorPrice: 235, type: 'Corporate Gifting', popular: true },
  { id: 'glo-2gb', network: 'Glo', name: '2.0GB Corporate', validity: '30 Days', userPrice: 510, vendorPrice: 470, type: 'Corporate Gifting' },
  { id: 'glo-3gb', network: 'Glo', name: '3.0GB Corporate', validity: '30 Days', userPrice: 765, vendorPrice: 705, type: 'Corporate Gifting' },
  { id: 'glo-5gb', network: 'Glo', name: '5.0GB Corporate', validity: '30 Days', userPrice: 1275, vendorPrice: 1175, type: 'Corporate Gifting', popular: true },
  { id: 'glo-10gb', network: 'Glo', name: '10.0GB Corporate', validity: '30 Days', userPrice: 2550, vendorPrice: 2350, type: 'Corporate Gifting' },

  // 9mobile
  { id: '9mob-1gb', network: '9mobile', name: '1.0GB Gifting', validity: '30 Days', userPrice: 245, vendorPrice: 220, type: 'Gifting', popular: true },
  { id: '9mob-2gb', network: '9mobile', name: '2.0GB Gifting', validity: '30 Days', userPrice: 490, vendorPrice: 440, type: 'Gifting' },
  { id: '9mob-3gb', network: '9mobile', name: '3.0GB Gifting', validity: '30 Days', userPrice: 735, vendorPrice: 660, type: 'Gifting' },
  { id: '9mob-5gb', network: '9mobile', name: '5.0GB Gifting', validity: '30 Days', userPrice: 1225, vendorPrice: 1100, type: 'Gifting' },
  { id: '9mob-10gb', network: '9mobile', name: '10.0GB Gifting', validity: '30 Days', userPrice: 2450, vendorPrice: 2200, type: 'Gifting' },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'sme-data',
    title: 'SME & Corporate Data',
    subtitle: 'MTN, Airtel, Glo & 9mobile at rock-bottom prices with instant auto-delivery',
    category: 'data',
    icon: 'Wifi',
    badge: 'Fast Delivery',
  },
  {
    id: 'airtime-vtu',
    title: 'Airtime Virtual Top-Up',
    subtitle: 'Up to 3-5% discount on all prepaid airtime recharge with 1-click dispatch',
    category: 'airtime',
    icon: 'PhoneCall',
    badge: 'Instant Bonus',
  },
  {
    id: 'electricity-bills',
    title: 'Electricity Token Bills',
    subtitle: 'Prepaid & Postpaid disco meters (IKEDC, EKEDC, AEDC, IBEDC, PHED, etc.)',
    category: 'utility',
    icon: 'Zap',
    badge: 'Zero Surcharge',
  },
  {
    id: 'cable-tv',
    title: 'Cable TV Subscriptions',
    subtitle: 'Instant IUC/Smartcard activation for DStv, GOtv, and StarTimes bouquets',
    category: 'cable',
    icon: 'Tv',
    badge: 'Immediate Recon',
  },
  {
    id: 'exam-tokens',
    title: 'Exam Result Checkers',
    subtitle: 'WAEC, NECO, and NABTEB verification e-pins delivered directly to SMS and screen',
    category: 'education',
    icon: 'GraduationCap',
    badge: 'Official Pins',
  },
  {
    id: 'airtime-to-cash',
    title: 'Airtime to Cash',
    subtitle: 'Convert excess or mistransferred recharge airtime directly into your bank account',
    category: 'finance',
    icon: 'ArrowLeftRight',
    badge: 'Up to 88% Value',
  },
  {
    id: 'recharge-printing',
    title: 'Recharge Card Printing',
    subtitle: 'Generate branded epins for all networks to print and sell physical recharge cards',
    category: 'airtime',
    icon: 'Printer',
    badge: 'Retail Ready',
  },
  {
    id: 'developer-api',
    title: 'Automated Reseller API',
    subtitle: 'RESTful API with 99.98% SLA, webhooks, and sub-second execution for dev platforms',
    category: 'finance',
    icon: 'Code2',
    badge: 'Dev Friendly',
  },
];

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod-pos-terminal',
    title: 'Pro Smart 4G Android POS Terminal',
    price: 38500,
    originalPrice: 45000,
    category: 'POS Terminals',
    description: 'Standalone Android POS device with built-in thermal printer, contactless NFC, and dual SIM 4G connectivity. Preloaded with Subplug agent firmware.',
    features: ['Instant receipt printing', 'Long-lasting 5200mAh battery', 'Supports all Nigerian debit cards', 'Free Subplug vendor SIM'],
    inStock: true,
    image: '/src/assets/images/store_shopping_mockup_1790292305560.jpg',
  },
  {
    id: 'prod-pocket-router',
    title: 'Subplug Ultra 4G+ LTE Pocket WiFi Router',
    price: 18500,
    originalPrice: 22000,
    category: 'Pocket MiFi',
    description: 'Unlocked universal high-speed portable MiFi router supporting MTN, Airtel, Glo, and 9mobile 4G bands with up to 10 connected devices.',
    features: ['Connects 10 users simultaneously', '3000mAh all-day battery', 'LCD battery & signal screen', 'Universal SIM compatibility'],
    inStock: true,
    image: '/src/assets/images/store_shopping_mockup_1790292305560.jpg',
  },
  {
    id: 'prod-bluetooth-printer',
    title: 'Subplug Bluetooth 58mm Thermal Printer',
    price: 16000,
    originalPrice: 19500,
    category: 'Thermal Printers',
    description: 'Portable thermal printer for printing recharge cards, data receipts, and bill tokens directly from your smartphone via Bluetooth.',
    features: ['Zero ink required', 'Pairs with Android & iOS', 'High-density 203 DPI print', 'Comes with 3 test paper rolls'],
    inStock: true,
    image: '/src/assets/images/store_shopping_mockup_1790292305560.jpg',
  },
  {
    id: 'prod-thermal-rolls',
    title: '58mm Premium Thermal Receipt Paper (Box of 20 Rolls)',
    price: 7500,
    originalPrice: 9000,
    category: 'Supplies',
    description: 'BPA-free high-sensitivity thermal paper rolls for POS machines and Bluetooth receipt printers. Crisp, dark text that resists fading.',
    features: ['Standard 58mm x 40mm roll size', 'Long-lasting print stability', 'Dust-free paper surface', 'Compatible with all 58mm printers'],
    inStock: true,
    image: '/src/assets/images/store_shopping_mockup_1790292305560.jpg',
  },
  {
    id: 'prod-desk-router',
    title: 'Subplug Pro 4G LTE Desk Router (High-Gain Antennas)',
    price: 29500,
    originalPrice: 35000,
    category: 'Pocket MiFi',
    description: 'Stationary high-speed desktop 4G router with dual external high-gain signal booster antennas and 4 LAN ports for cyber cafes and business hubs.',
    features: ['Up to 32 concurrent devices', 'Includes RJ45 Gigabit Ethernet port', 'External SMA high-gain antennas', 'Supports all Nigerian telecom bands'],
    inStock: true,
    image: '/src/assets/images/store_shopping_mockup_1790292305560.jpg',
  },
  {
    id: 'prod-powerbank-router',
    title: 'Subplug 2-in-1 10,000mAh MiFi Powerbank Hybrid',
    price: 24000,
    originalPrice: 28000,
    category: 'Pocket MiFi',
    description: 'Heavy-duty 10,000mAh power bank integrated with universal 4G LTE MiFi modem. Charge your smartphone while staying connected all day.',
    features: ['Up to 24 hours continuous WiFi runtime', 'Fast charging 2.4A USB output', 'High-speed Cat4 150Mbps modem', 'Compact pocketable form factor'],
    inStock: true,
    image: '/src/assets/images/store_shopping_mockup_1790292305560.jpg',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'How to Build a ₦150k/Month Passive Income Stream With VTU Reselling in Nigeria',
    excerpt: 'Step-by-step practical guide on starting a data and bill top-up business with zero capital overhead using wholesale APIs and customer loyalty tactics.',
    content: [
      'In Nigeria today, smartphones and the internet are basic essentials of daily life. Over 120 million active telecom lines consume billions of gigabytes of data and airtime every single week.',
      'Becoming a VTU reseller on SUBPLUG allows you to tap into this recurring revenue without maintaining physical inventory or running risky equipment.',
      'Key strategies include setting up automated WhatsApp broadcast groups, serving local university students with SME bundles, and deploying physical recharge vouchers in neighborhood kiosks.',
      'With wholesale margins of ₦20 to ₦60 per gigabyte and daily transaction volumes of 100+ purchases, realistic monthly net earnings between ₦120,000 and ₦250,000 are readily attainable.'
    ],
    date: 'Sep 21, 2026',
    readTime: '4 min read',
    author: 'Tunde Adeleke',
    category: 'Business Growth',
    image: '/src/assets/images/blog_vtu_business_1790292325616.jpg',
  },
  {
    id: 'post-2',
    title: 'SME vs Corporate Gifting vs Direct Data: What Every Nigerian Smartphone User Must Know',
    excerpt: 'Unraveling the mystery of telecom data band definitions, speed throttling differences, and how to get maximum internet value on MTN, Airtel, and Glo.',
    content: [
      'Many consumers frequently ask why 1GB of data can cost ₦1,000 on official telco USSD shortcodes while costing only ₦260 on automated platforms like SUBPLUG.',
      'The difference lies in volume-tier enterprise allocations. Telcos offer Small & Medium Enterprise (SME) quotas and Corporate Gifting (CG) allocations to licensed bulk partners at deeply discounted wholesale tranches.',
      'These gigabytes route through identical cell towers and 4G/5G base stations as standard subscriptions, with zero speed penalties.',
      'By routing your top-ups via Subplug, you bypass telecom consumer markups and retain your data validity for a full 30 days.'
    ],
    date: 'Sep 18, 2026',
    readTime: '3 min read',
    author: 'Chioma Okonjo',
    category: 'Consumer Guide',
    image: '/src/assets/images/blog_data_savings_1790292315638.jpg',
  },
  {
    id: 'post-3',
    title: 'How to Integrate Subplug RESTful VTU API into Your Web or Mobile App in 10 Minutes',
    excerpt: 'A comprehensive technical tutorial on authenticating, querying wallet balances, and automating telecom data webhooks for software engineers in Nigeria.',
    content: [
      'Building a fintech app or automated WhatsApp bot in Nigeria requires a telecom API provider with guaranteed sub-second response times and 99.98% delivery SLAs.',
      'The Subplug Developer API provides clean JSON endpoints with Bearer token authentication, idempotency keys, and instant automated reversal callbacks on failed upstream carrier queries.',
      'Whether you build with Node.js, Python, Laravel, or Flutter, our SDKs and Postman collections allow developers to go live within hours.',
      'We also provide sandbox wallets with zero risk and automated virtual account integration for Moniepoint and Wema bank webhooks.'
    ],
    date: 'Sep 14, 2026',
    readTime: '5 min read',
    author: 'Emeka Nwosu',
    category: 'Developer Tutorial',
    image: '/src/assets/images/blog_vtu_business_1790292325616.jpg',
  },
  {
    id: 'post-4',
    title: 'The Ultimate Blueprint to Printing and Selling Physical Recharge Cards in Nigeria',
    excerpt: 'How to leverage Subplug e-pin generation to run a profitable neighborhood recharge card printing center with a thermal printer.',
    content: [
      'Despite the rise of digital banking apps, over 40% of airtime and data purchases in Nigerian neighborhood street markets are still made through scratch cards and printed e-pins.',
      'Using our Subplug Bluetooth 58mm Thermal Printer and Web Voucher Generator, merchants can print branded epins with their business name and custom helpline stamped on every ticket.',
      'This creates immediate brand visibility, customer loyalty, and recurring cash turnover in university campuses, bus parks, and residential estates.'
    ],
    date: 'Sep 09, 2026',
    readTime: '4 min read',
    author: 'Tunde Adeleke',
    category: 'Business Growth',
    image: '/src/assets/images/blog_data_savings_1790292315638.jpg',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I fund my Subplug wallet?',
    answer: 'You can fund your wallet instantaneously 24/7 through dedicated virtual bank accounts (Moniepoint, Wema Bank, Sterling Bank) generated specifically for your account upon registration. You can also pay via debit card (Mastercard/Visa/Verve) or USSD code.',
  },
  {
    id: 'faq-2',
    question: 'How long does data and airtime delivery take?',
    answer: 'All data, airtime, electricity tokens, and cable subscriptions are fully automated via our direct telco server switches. Delivery occurs within 1 to 5 seconds of confirmation.',
  },
  {
    id: 'faq-3',
    question: 'How do I become a Subplug Vendor / Reseller?',
    answer: 'Register a free customer account, then click "Become a Vendor" or "Upgrade to Vendor". Pay the one-time vendor activation fee (₦1,500 for Reseller Agent Tier or ₦3,500 for Full API Partner Tier). There are zero recurring monthly renewal fees; you immediately unlock lifetime wholesale tier-1 rates, developer API credentials, and priority telco switch routing.',
  },
  {
    id: 'faq-4',
    question: 'Is my money and personal information safe?',
    answer: 'Yes, completely. Subplug operates on bank-grade 256-bit SSL encryption, PCI-DSS compliance, and zero storage of card credentials. All banking switch settlements are backed by NDIC-insured financial institutions.',
  },
  {
    id: 'faq-5',
    question: 'How does Airtime to Cash work?',
    answer: 'If you mistakenly transferred excess airtime or received airtime you wish to liquidate, select "Airtime to Cash", follow the quick prompt to transfer the balance to our designated corporate line, and funds are disbursed to your bank within 5 minutes.',
  },
  {
    id: 'faq-6',
    question: 'Do you offer an API for developers and external platforms?',
    answer: 'Yes! We provide robust RESTful APIs with comprehensive documentation, sandbox testing environments, sub-second response times, and webhooks for seamless integration into your web or mobile applications.',
  },
];
