import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  User, 
  Sparkles,
  Send,
  CheckCircle2
} from 'lucide-react';
import { BLOG_POSTS } from '../data/mockData';
import { BlogPost } from '../types';
import { isValidEmail, cleanRawInput } from '../utils/security';

interface BlogPageProps {
  onBackToHome: () => void;
  onReadPost: (post: BlogPost) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBackToHome, onReadPost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const categories = ['All', 'Business Growth', 'Consumer Guide', 'Developer Tutorial'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeError('');
    const cleanMail = newsletterEmail.trim();
    if (!isValidEmail(cleanMail)) {
      setSubscribeError('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 5000);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">Subplug Editorial</span>
            <span>·</span>
            <span>Updated Weekly</span>
          </div>
        </div>

        {/* Blog Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <BookOpen className="h-4 w-4" />
              <span>Telecom Market Insights & Reseller Guides</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Subplug Knowledge Hub.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Stay ahead with proven VTU business blueprints, telecom tariff analysis, and practical technical guides for Nigerian entrepreneurs and developers.
            </p>
          </div>
        </div>

        {/* Featured Story Marquee */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 group hover:border-slate-700 transition-all">
            <div className="lg:col-span-6 relative h-64 lg:h-auto overflow-hidden bg-slate-950">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">{featuredPost.category}</span>
                  <span>·</span>
                  <span>Featured Story</span>
                  <span>·</span>
                  <span>{featuredPost.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {featuredPost.title}
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  By <strong className="text-slate-200">{featuredPost.author}</strong> · {featuredPost.date}
                </div>
                <button
                  onClick={() => onReadPost(featuredPost)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Read Story</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              maxLength={40}
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(cleanRawInput(e.target.value, 40))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col justify-between bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 overflow-hidden group transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-slate-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400">{post.category}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-7 pb-6 pt-2 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-xs text-slate-500">By {post.author}</span>
                <button
                  onClick={() => onReadPost(post)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group/link"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h3 className="text-2xl font-bold text-white">Subscribe to Telecom Rate Updates</h3>
            <p className="text-sm text-slate-400">
              Get weekly email alerts on wholesale price changes, NCC regulatory shifts, and special vendor promotional discounts.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-w-[280px]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Subscribe</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {subscribed && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Thank you for subscribing! You will receive our next Nigerian telecom tariff update.</span>
          </div>
        )}

      </div>
    </div>
  );
};
