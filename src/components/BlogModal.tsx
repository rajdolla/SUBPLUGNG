import React from 'react';
import { X, Calendar, Clock, User, Share2, Check } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogModalProps {
  isOpen: boolean;
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, post, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !post) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Thumbnail */}
        <div className="rounded-2xl overflow-hidden mb-6 h-60 bg-slate-950">
          <img
            src={post.image}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span className="font-semibold text-emerald-400">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.date}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>By {post.author}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-6">
          {post.title}
        </h2>

        {/* Article Body */}
        <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800 pt-6">
          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 bg-slate-800 rounded-xl transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer"
          >
            Close Article
          </button>
        </div>

      </div>
    </div>
  );
};
