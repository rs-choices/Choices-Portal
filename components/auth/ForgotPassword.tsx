'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, TextButton } from '@/components/ui/Button';
import { FieldError, Input, Label } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { AuthHeading, SuccessMark } from './AuthShell';
import { BackToSignIn } from './BackToSignIn';

export function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('layla@qahwahouse.ae');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [resent, setResent] = useState(false);

  return (
    <>
      {sent ? (
        <>
          <SuccessMark icon={<Icon name="mail" size={28} />} />
          <AuthHeading title="Check your email">
            We sent a reset link to <span className="font-semibold text-fg">{email}</span>. It expires in 30 minutes.
          </AuthHeading>
          <Button size="block" onClick={() => router.push('/reset-password')}>
            Open reset link
          </Button>
          <div className="text-center text-[13px] text-ink-muted">
            {resent ? (
              `Reset link sent again to ${email}.`
            ) : (
              <>
                Didn&apos;t get it? Check your spam folder or <TextButton onClick={() => setResent(true)}>send it again</TextButton>.
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <AuthHeading title="Forgot your password?">Enter the email you use for Choices and we&apos;ll send you a link to reset it.</AuthHeading>
          <Label label="Email">
            <Input size="lg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourvenue.ae" />
            {error && <FieldError>Enter a valid email address.</FieldError>}
          </Label>
          <Button
            size="block"
            onClick={() => {
              const ok = /^\S+@\S+\.\S+$/.test(email);
              setError(!ok);
              setSent(ok);
            }}
          >
            Send reset link
          </Button>
        </>
      )}
      <BackToSignIn />
    </>
  );
}
