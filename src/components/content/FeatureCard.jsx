export function FeatureCard({ icon, title, description }) {
  return (
    <div class="rounded-2xl p-6 bg-dark-800 border border-dark-600">
      <div class="text-3xl mb-4">{icon}</div>
      <h3 class="text-lg font-semibold text-white mb-2">{title}</h3>
      <p class="text-dark-300 leading-relaxed">{description}</p>
    </div>
  );
}
