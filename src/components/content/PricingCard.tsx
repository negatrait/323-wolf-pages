export function PricingCard({
  name,
  price,
  period,
  features,
  popular,
  ctaText,
  ctaHref,
}) {
  return (
    <div
      class={`relative rounded-2xl p-8 border ${popular ? 'border-primary shadow-glow bg-dark-800' : 'border-dark-600 bg-dark-800'} flex flex-col`}
    >
      {popular && (
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-dark-900 text-xs font-bold rounded-full">
          MOST POPULAR
        </span>
      )}
      <h3 class="text-xl font-bold text-white mb-2">{name}</h3>
      <div class="mb-6">
        <span class="text-4xl font-bold text-white">{price}</span>
        {period && <span class="text-dark-300 ml-1">{period}</span>}
      </div>
      <ul class="space-y-3 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} class="flex items-start gap-2 text-dark-200">
            <span class="material-symbols-outlined text-primary text-lg mt-0.5">
              check_circle
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={ctaHref}
        class={`block text-center py-3 rounded-lg font-semibold transition-colors ${popular ? 'bg-primary text-dark-900 hover:bg-primary-dark' : 'bg-dark-600 text-white hover:bg-dark-500'}`}
      >
        {ctaText}
      </a>
    </div>
  );
}
