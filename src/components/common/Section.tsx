import type { ComponentChildren } from 'preact';

interface SectionProps {
  children?: ComponentChildren;
  dark?: boolean;
  class?: string;
}

export function Section({
  children,
  dark = true,
  class: cls = '',
}: SectionProps) {
  return (
    <section
      class={`py-20 lg:py-28 ${dark ? 'bg-dark-900' : 'bg-dark-800'} ${cls}`}
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
