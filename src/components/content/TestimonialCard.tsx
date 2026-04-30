interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <div class="bg-dark-800 border border-dark-600 rounded-xl p-6">
      <p class="text-dark-200 italic mb-4">"{quote}"</p>
      <div class="text-sm">
        <span class="text-white font-medium">{name}</span>
        <span class="text-dark-400 ml-2">{role}</span>
      </div>
    </div>
  );
}
