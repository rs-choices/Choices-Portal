'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FieldError, Input, Label } from '@/components/ui/Field';
import { AuthHeading } from './AuthShell';

// No auth yet: any non-empty password goes straight to the dashboard.
export function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('layla@qahwahouse.ae');
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!pw) return setError(true);
        router.push('/dashboard');
      }}
    >
      <AuthHeading title="Welcome back">Sign in to manage your venue on Choices.</AuthHeading>
      <Label label="Email">
        <Input size="lg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Label>
      <Label
        label={
          <span className="flex justify-between">
            Password
            <Link href="/forgot-password" className="text-[13px] font-medium text-brand-peach hover:text-brand-peach-hover">
              Forgot password?
            </Link>
          </span>
        }
      >
        <Input
          size="lg"
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="Enter your password"
        />
        {error && <FieldError>Enter your password to continue.</FieldError>}
      </Label>
      <Button type="submit" size="block">
        Sign in
      </Button>
      <div className="flex items-center gap-3 text-[13px] text-fg-subtle">
        <div className="h-px flex-1 bg-surface-muted" />
        New to Choices?
        <div className="h-px flex-1 bg-surface-muted" />
      </div>
      <Button variant="secondary" size="block" onClick={() => router.push('/onboarding')}>
        List your venue
      </Button>
      <div className="text-center text-xs text-fg-subtle">From AED 299 a month. No contract, cancel any time.</div>
    </form>
  );
}
