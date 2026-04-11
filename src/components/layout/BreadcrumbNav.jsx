export function BreadcrumbNav({ currentPage }) {
  return (
    <nav class="text-sm text-dark-400 mb-6">
      <a href="/" class="hover:text-primary transition-colors">Home</a>
      <span class="mx-2">/</span>
      <span class="text-dark-200">{currentPage}</span>
    </nav>
  );
}
