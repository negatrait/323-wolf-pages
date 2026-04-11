import { useState } from 'preact/hooks';

export function Accordion({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div class="border-b border-dark-600">
      <button
        class="w-full flex justify-between items-center py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span class="text-lg font-medium pr-4">{question}</span>
        <span class={`material-symbols-outlined text-dark-400 transform transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div class="pb-5 text-dark-300 leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}
