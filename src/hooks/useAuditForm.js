import { useState, useMemo } from 'preact/hooks';

export function useAuditForm() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isValid = useMemo(() => {
    const urlPattern = /^https?:\/\/.+\..+/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return urlPattern.test(url) && emailPattern.test(email);
  }, [url, email]);

  const submit = async () => {
    if (!isValid) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.replace(/\/+$/, ''), email }),
      });
      if (!res.ok) throw new Error(res.status === 422 ? 'Invalid URL format' : 'Something went wrong');
      setResult(await res.json());
      setStatus('success');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  };

  const reset = () => { setStatus('idle'); setResult(null); setError(null); };

  return { url, setUrl, email, setEmail, status, result, error, isValid, submit, reset };
}
