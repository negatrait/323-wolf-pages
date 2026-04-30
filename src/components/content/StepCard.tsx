interface StepCardProps {
  number: string | number;
  title: string;
  description: string;
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div class="flex gap-4">
      <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
        <span class="text-primary font-bold text-lg">{number}</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-white mb-2">{title}</h3>
        <p class="text-dark-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
