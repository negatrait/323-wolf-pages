interface FeatureCardProps {
  icon?: string;
  title: string;
  desc: string;
}

export function FeatureCard({ title, desc }: FeatureCardProps) {
  return (
    <div class="bg-dark-800 border border-dark-600 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-2">{title}</h3>
      <p class="text-dark-300">{desc}</p>
    </div>
  );
}
