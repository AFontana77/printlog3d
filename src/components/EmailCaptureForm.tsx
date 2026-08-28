'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Email capture for printlog3d.com.
 *
 * This form used to call preventDefault and do nothing else, so every
 * address anyone typed was discarded behind a working-looking button.
 *
 * It now posts to /api/subscribe and only reports success when the backend
 * accepts the address. Consent is explicit and starts unchecked. The only
 * thing asked for is an email address.
 */

interface EmailCaptureFormProps {
  buttonLabel: string;
  /** Page the form sits on, stored so we know which content earns signups. */
  source?: string;
  /** Which offer this responded to. */
  campaign?: string;
}

type State = 'idle' | 'sending' | 'done' | 'error';

export function EmailCaptureForm({
  buttonLabel,
  source = 'printlog3d.com',
  campaign = 'signup',
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState('');
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;

    if (!consent) {
      setState('error');
      setMessage('Please tick the box so we know it is okay to email you.');
      return;
    }

    setState('sending');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source, campaign, _hp: hp }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMessage(body.error || 'Something went wrong. Please try again.');
        return;
      }
      setState('done');
    } catch {
      setState('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (state === 'done') {
    return (
      <div
        className="px-4 py-4 text-sm"
        role="status"
      >
        You&apos;re on the list. Thanks for signing up.
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      {/* Honeypot. Hidden from people, tempting to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <input
        type="email"
        required
        placeholder="your@email.com"
        aria-label="Email address"
        className="w-full px-4 py-3 rounded-xl border border-brand-soft bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700 text-base min-h-[48px]"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={state === 'sending'}
      />
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors press-feedback min-h-[48px]"
        disabled={state === 'sending'}
      >
        {state === 'sending' ? 'Sending...' : <>{buttonLabel} <ArrowRight size={18} /></>}
      </button>

      <label className="flex items-start gap-2.5 text-sm cursor-pointer opacity-90">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span>Send me the download and occasional 3D printing resources. Unsubscribe anytime.</span>
      </label>

      {state === 'error' && message ? (
        <p className="text-sm" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
