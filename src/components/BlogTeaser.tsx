import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/mockData';
import { BlogPost } from '../types';

interface BlogTeaserProps {
  onGoToBlog: () => void;
  onReadPost: (post: BlogPost) => void;
}

export const BlogTeaser: React.FC<BlogTeaserProps> = ({ onGoToBlog, onReadPost }) => {
  const previewPosts = BLOG_POSTS.slice(0, 2);

  return (
    <section id="blog-teaser" className="py-16 sm:py-20 bg-slate-900/30 border-y border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Industry Knowledge & Guides
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Latest Telecom News & Tips.
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-xl">
              Stay informed on telecom tariff updates, SME data strategies, and practical blueprints to grow your VTU business in Nigeria.
            </p>
          </div>

          <button
            onClick={onGoToBlog}
            className="self-start md:self-auto min-h-[44px] px-6 py-2.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>Visit Full Blog Page</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 2-Card Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previewPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col justify-between bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all duration-200"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400">{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => onReadPost(post)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group/link"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
