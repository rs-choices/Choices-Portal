'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FieldError, Input, Label } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { AuthHeading, SuccessMark } from './AuthShell';

const EMAIL = 'layla@qahwahouse.ae';

export function ResetPassword() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  const rules: [string, boolean][] = [
    ['At least 8 characters', pw.length >= 8],
    ['Includes a number', /\d/.test(pw)],
    ['Both passwords match', pw.length > 0 && pw === pw2],
  ];
  const score = [pw.length >= 8, /\d/.test(pw), /[A-Z]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  const barColour = score <= 1 ? 'bg-brand-peach' : score <= 2 ? 'bg-amber' : 'bg-brand-teal';

  if (done) {
    return (
      <>
        <SuccessMark icon={<Icon name="check" size={30} stroke={2.4} />} />
        <AuthHeading title="Password updated">You&apos;re all set. For your security, we&apos;ve signed you out on other devices.</AuthHeading>
        <Button size="block" onClick={() => router.push('/sign-in')}>
          Sign in
        </Button>
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Set a new password">For {EMAIL}. You&apos;ll use this to sign in from now on.</AuthHeading>
      <Label label="New password">
        <Input
          size="lg"
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="At least 8 characters"
        />
      </Label>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-[5px] flex-1 rounded-[5px] ${i < score ? barColour : 'bg-surface-muted'}`} />
        ))}
      </div>
      <Label label="Confirm new password">
        <Input
          size="lg"
          type="password"
          value={pw2}
          onChange={(e) => {
            setPw2(e.target.value);
            setError(false);
          }}
          placeholder="Type it again"
        />
      </Label>
      <div className="flex flex-col gap-2">
        {rules.map(([label, ok]) => (
          <div key={label} className={`flex items-center gap-2 text-[13px] ${ok ? 'text-fg' : 'text-ink-muted'}`}>
            <span className={`grid size-[18px] shrink-0 place-items-center rounded-full text-inverse ${ok ? 'bg-brand-teal' : 'bg-line-strong'}`}>
              <Icon name="check" size={11} stroke={3.5} />
            </span>
            {label}
          </div>
        ))}
      </div>
      {error && <FieldError className="-mt-2">Make sure your password meets all three rules.</FieldError>}
      <Button size="block" onClick={() => (rules.every((r) => r[1]) ? setDone(true) : setError(true))}>
        Update password
      </Button>
    </>
  );
}
