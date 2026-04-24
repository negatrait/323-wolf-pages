import { Section } from '../components/common/Section';
import { BreadcrumbNav } from '../components/layout/BreadcrumbNav';
import { Head } from '../components/seo/Head';
import { getRouteMeta } from '../data/route-meta';
import { BLOG_POSTS_MAP, SITE_CONFIG } from '../data/load-content';

export function BlogPost({ slug }) {
  const post = BLOG_POSTS_MAP[slug];
  const meta = getRouteMeta(`/blog/${slug}`);

  if (!post) {
    return (
      <>
        <Head title="Post Not Found" />
        <Section>
          <div class="max-w-4xl mx-auto py-20 text-center">
            <h1 class="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <a href="/blog" class="text-primary hover:underline">
              ← Back to Blog
            </a>
          </div>
        </Section>
      </>
    );
  }

  // Format date nicely
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Article schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${slug}`,
    },
  };

  return (
    <>
      <Head
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        structuredData={articleJsonLd}
      />

      <Section>
        <BreadcrumbNav
          currentPage={post.title}
          extraLink={{ label: 'Blog', href: '/blog' }}
        />

        <article class="max-w-4xl mx-auto">
          {/* Category & Date */}
          <div class="flex items-center gap-4 mb-6">
            <span class="bg-primary/10 text-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {post.category}
            </span>
            <span class="text-dark-400 text-[0.625rem] uppercase tracking-widest font-bold">
              {formatDate(post.date)}
            </span>
            <span class="text-dark-400 text-[0.625rem] uppercase tracking-widest font-bold">
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Article Body */}
          <div class="prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          {/* Back to Blog */}
          <div class="mt-16 pt-8 border-t border-dark-700/30">
            <a
              href="/blog"
              class="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-semibold"
            >
              <span class="material-symbols-outlined text-xl">arrow_back</span>
              Back to Blog
            </a>
          </div>
        </article>
      </Section>
    </>
  );
}
