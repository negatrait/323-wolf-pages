import { useState, useEffect } from 'preact/hooks';
import { Head } from '../components/seo/Head';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { BLOG_CONFIG } from '../data/blog-content';

export function Blog() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = BLOG_CONFIG.posts.filter(p => {
    const matchCat = activeCategory === 'ALL' || p.category === activeCategory;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Head
        title="Blog — Website Visibility Insights"
        description="SEO tips, audit findings, and actionable guides for improving your website visibility."
        canonical="https://sivussa.com/blog"
      />

      <div class="max-w-7xl mx-auto px-6 md:px-8">
        {/* Breadcrumb */}
        <nav class="py-8">
          <ul class="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-dark-300">
            <li><a href="/" class="hover:text-primary transition-colors">Home</a></li>
            <li><span class="material-symbols-outlined text-[10px]">chevron_right</span></li>
            <li class="text-primary">Blog</li>
          </ul>
        </nav>

        {/* Hero */}
        <section class="pb-16 pt-4 border-b border-dark-700/30">
          <h1 class="text-[5rem] md:text-[10rem] font-black leading-[0.8] tracking-tighter text-dark-100 mb-8">
            {BLOG_CONFIG.title}
          </h1>
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div class="max-w-xl">
              <p class="text-dark-300 text-lg leading-relaxed">
                {BLOG_CONFIG.description}
              </p>
            </div>
            <div class="w-full md:w-96 relative">
              <input
                class="w-full bg-dark-600 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 text-dark-100 placeholder:text-dark-500 text-[0.6875rem] font-bold uppercase tracking-widest py-4 px-0 outline-none"
                placeholder={BLOG_CONFIG.searchPlaceholder}
                type="text"
                value={searchQuery}
                onInput={(e) => setSearchQuery(e.target.value)}
              />
              <span class="absolute right-0 top-4 material-symbols-outlined text-dark-400">search</span>
            </div>
          </div>
        </section>

        {/* Filters */}
        <nav class="py-12 overflow-x-auto whitespace-nowrap">
          <div class="flex gap-4">
            {BLOG_CONFIG.categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                class={`px-6 py-2 text-[0.6875rem] font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-dark-900 border border-primary'
                    : 'border border-dark-600/50 text-dark-300 hover:border-primary hover:text-dark-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        {/* Blog Grid */}
        <section class="grid grid-cols-1 md:grid-cols-3 gap-px bg-dark-600/20 mb-20">
          {filtered.length > 0 ? filtered.map((post, i) => (
            <article key={i} class="bg-dark-900 group p-6 md:p-8 flex flex-col h-full border-b md:border-b-0 border-dark-600/20">
              <div class="aspect-video w-full mb-8 overflow-hidden bg-dark-700 relative">
                <div class="w-full h-full bg-dark-700 flex items-center justify-center">
                  <span class="material-symbols-outlined text-4xl text-dark-500">article</span>
                </div>
                <div class="absolute top-4 left-4 bg-dark-900/80 backdrop-blur-md px-3 py-1">
                  <span class="text-[10px] font-black uppercase tracking-widest text-primary">{post.category}</span>
                </div>
              </div>
              <div class="flex-grow">
                <h2 class="text-xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p class="text-dark-300 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div class="flex items-center justify-between mt-auto pt-6 border-t border-dark-700/20">
                <span class="text-[0.625rem] uppercase tracking-widest font-bold text-dark-400">{post.date}</span>
                <span class="text-[0.625rem] uppercase tracking-widest font-bold text-dark-400">{post.readTime}</span>
              </div>
            </article>
          )) : (
            <div class="col-span-1 md:col-span-3 py-20 text-center">
              <p class="text-dark-400">No articles found.</p>
            </div>
          )}
        </section>

        {/* Load More */}
        <div class="flex justify-center pb-24">
          <a
            href={BLOG_CONFIG.loadMoreLink}
            target="_blank"
            rel="noopener"
            class="bg-gradient-to-br from-primary to-[#6EDE69] text-dark-900 px-12 py-4 text-[0.6875rem] font-black uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all"
          >
            {BLOG_CONFIG.loadMoreText}
          </a>
        </div>
      </div>
    </>
  );
}
