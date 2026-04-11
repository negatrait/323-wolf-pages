export function TestimonialCard({ quote, name, role }) {
  return (
    <div class="rounded-2xl p-6 bg-dark-800 border border-dark-600">
      <p class="text-dark-200 leading-relaxed mb-4">"{quote}"</p>
      <div class="text-sm">
        <span class="text-white font-medium">{name}</span>
        <span class="text-dark-400 ml-1">— {role}</span>
      </div>
    </div>
  );
}
