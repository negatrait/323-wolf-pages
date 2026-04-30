interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div class="rounded-2xl p-6 bg-dark-800 border border-dark-600">
      <h3 class="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p class="text-dark-300 leading-relaxed">{description}</p>
    </div>
  );
}
