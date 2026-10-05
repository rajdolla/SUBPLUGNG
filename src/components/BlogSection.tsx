import React from 'react';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../data/mockData';
import { BlogPost } from '../types';

interface BlogSectionProps {
  onReadPost: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onReadPost }) => {
  return (
    <section id="blog" className="py-16 sm:py-20 bg-slate-900/30 border-y border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Industry Knowledge & Guides
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Latest News & Tips.
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-xl">
              Stay informed on telecom tariff updates, SME data strategies, and practical blueprints to grow your VTU business in Nigeria.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span>Updated Weekly by Telecom Experts</span>
          </div>
        </div>

        {/* Layout: Horizontal scroll on mobile, 2-column grid on desktop */}
        <div className="flex overflow-x-auto pb-4 gap-6 md:grid md:grid-cols-2 md:overflow-visible scrollbar-none snap-x snap-mandatory">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="min-w-[85vw] sm:min-w-[420px] md:min-w-0 snap-center flex flex-col justify-between bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all duration-200 group"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative h-52 sm:h-60 overflow-hidden bg-slate-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Clean unboxed metadata per design constitution */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span className="font-semibold text-emerald-400">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer with Read More CTA */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => onReadPost(post)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group/link"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
