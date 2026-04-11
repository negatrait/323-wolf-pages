import { useAuditForm } from '../../hooks/useAuditForm';

export function AuditForm({ variant = 'hero' }) {
  const { url, setUrl, email, setEmail, status, result, error, isValid, submit, reset } = useAuditForm();

  if (status === 'success' && result) {
    const { scores } = result;
    return (
      <div class="rounded-2xl p-8 bg-dark-800 border border-dark-600">
        <h3 class="text-2xl font-bold text-white mb-6 text-center">Your Visibility Score</h3>
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center">
            <span class="text-3xl font-bold text-primary">{scores?.overall || '?'}</span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'SEO', score: scores?.seo },
            { label: 'GEO', score: scores?.geo },
            { label: 'AEO', score: scores?.aeo },
          ].map(s => (
            <div key={s.label} class="text-center">
              <div class="text-lg font-bold text-white">{s.score ?? '—'}</div>
              <div class="text-xs text-dark-400">{s.label}</div>
            </div>
          ))}
        </div>
        <div class="text-center">
          <a href="/pricing" class="text-primary hover:underline font-medium">Upgrade for detailed reports & progress tracking →</a>
        </div>
        <button onClick={reset} class="mt-4 text-sm text-dark-400 hover:text-white block mx-auto">Run another audit</button>
      </div>
    );
  }

  const isDark = variant === 'hero';

  return (
    <div class={`rounded-2xl p-6 ${isDark ? 'bg-dark-800/80 border border-dark-600' : 'bg-dark-800 border border-dark-600'}`}>
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          placeholder="Enter your website URL"
          value={url}
          onInput={(e) => setUrl(e.target.value)}
          class="flex-1 px-4 py-3 rounded-lg bg-dark-700 border border-dark-500 text-white placeholder-dark-400 focus:outline-none focus:border-primary transition-colors"
          disabled={status === 'submitting'}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onInput={(e) => setEmail(e.target.value)}
          class="flex-1 px-4 py-3 rounded-lg bg-dark-700 border border-dark-500 text-white placeholder-dark-400 focus:outline-none focus:border-primary transition-colors"
          disabled={status === 'submitting'}
        />
        <button
          onClick={submit}
          disabled={!isValid || status === 'submitting'}
          class="px-6 py-3 bg-primary text-dark-900 font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'submitting' ? 'Analyzing...' : 'Get Your Fix Plan'}
        </button>
      </div>
      {error && <p class="mt-3 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
