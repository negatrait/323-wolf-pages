interface BreadcrumbNavProps {
  currentPage: string;
  extraLink?: { label: string; href: string };
}

export function BreadcrumbNav({ currentPage, extraLink }: BreadcrumbNavProps) {
  return (
    <nav aria-label="breadcrumb" class="text-sm text-dark-400 mb-6">
      <a href="/" class="hover:text-primary transition-colors">
        Home
      </a>
      <span class="mx-2">/</span>
      {extraLink && (
        <>
          <a href={extraLink.href} class="hover:text-primary transition-colors">
            {extraLink.label}
          </a>
          <span class="mx-2">/</span>
        </>
      )}
      <span class="text-dark-200">{currentPage}</span>
    </nav>
  );
}
