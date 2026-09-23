import Image from 'next/image';
import type { ReactNode } from 'react';

// Split layout for sign in and password screens: photo on the left from 900px
// up, form on the right.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface text-sm text-fg">
      <div className="relative hidden min-h-screen flex-[1_1_50%] bg-brand-purple bg-[url('/assets/popular-offer-hero.jpg')] bg-cover bg-center min-[900px]:block">
        <div className="absolute inset-0 bg-linear-to-t from-scrim/85 to-scrim/10 to-60%" />
        <div className="absolute right-12 bottom-14 left-12 flex flex-col gap-3.5 text-inverse">
          <div className="text-[40px] leading-[1.1] font-bold text-pretty">Get discovered by people nearby.</div>
          <div className="max-w-[440px] text-[17px] leading-normal opacity-92">
            Post offers, manage bookings and see how customers find you, all in one place.
          </div>
        </div>
      </div>
      <div className="flex flex-[1_1_50%] items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-[400px] flex-col gap-5">
          <Image src="/assets/choices-logo-02.png" alt="Choices" width={151} height={56} priority className="-ml-2 h-14 w-auto self-start" />
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthHeading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="m-0 text-[28px] font-bold text-brand-purple">{title}</h1>
      <div className="text-[15px] leading-normal text-ink-muted">{children}</div>
    </div>
  );
}

export function SuccessMark({ icon }: { icon: ReactNode }) {
  return (
    <div className="grid size-16 place-items-center rounded-full bg-brand-teal/12 text-brand-teal">
      {icon}
    </div>
  );
}
