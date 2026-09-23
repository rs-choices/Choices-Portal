'use client';

import { usePortal } from '@/components/portal/PortalProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { INVOICES, PLAN_PRICE, PLANS } from '@/lib/portal/data';

export function Billing() {
  const { plan, setPlan, showToast } = usePortal();

  const pick = (name: (typeof PLANS)[number]['name']) => {
    if (name === 'Enterprise') {
      showToast('Thanks! Our sales team will call you within one working day.');
      return;
    }
    setPlan(name);
    showToast(`You are now on ${name}. Changes apply from today.`);
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <div className="flex flex-col gap-2 rounded-xl bg-brand-purple p-6 text-inverse">
          <span className="text-[13px] opacity-80">Current plan</span>
          <span className="text-[28px] font-bold">{plan}</span>
          <span className="text-sm opacity-90">Next payment of {PLAN_PRICE[plan]} + 5% VAT on 1 Oct 2026</span>
          <span className="mt-1.5 text-xs opacity-75">Monthly billing · No contract · Cancel any time</span>
        </div>
        <Card className="flex flex-col gap-3 p-6">
          <span className="text-[13px] text-ink-muted">Payment method</span>
          <div className="flex items-center gap-3.5">
            <div className="grid h-9 w-[52px] place-items-center rounded-sm bg-fg text-[11px] font-bold tracking-[0.05em] text-inverse">VISA</div>
            <div>
              <div className="font-semibold">Visa ending 4821</div>
              <div className="text-xs text-ink-muted">Expires 08/28 · Emirates NBD</div>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="self-start">
            Update card
          </Button>
        </Card>
      </div>

      <h2 className="mt-2 mb-0 text-lg font-bold text-brand-purple">Plans</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        {PLANS.map((p) => {
          const current = p.name === plan;
          return (
            <div key={p.name} className={`flex flex-col gap-3.5 rounded-xl bg-surface p-6 ${current ? 'shadow-card-selected' : 'shadow-card'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-bold text-brand-purple">{p.name}</span>
                {current && <Badge className="bg-brand-peach/14 px-2.5 py-1 text-[11px] text-peach-ink">Your plan</Badge>}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-bold text-fg">{p.price}</span>
                <span className="text-[13px] text-ink-muted">{p.unit}</span>
              </div>
              <div className="flex flex-1 flex-col gap-2.5">
                {p.feats.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <Icon name="check" size={16} stroke={2.6} className="text-brand-teal" />
                    {f}
                  </div>
                ))}
              </div>
              {current ? (
                <div className="rounded-pill bg-fill-soft p-[13px] text-center font-button font-bold text-fg-subtle">Current plan</div>
              ) : (
                <Button size="md" className="py-[13px]" onClick={() => pick(p.name)}>
                  {p.name === 'Enterprise' ? 'Talk to sales' : `Switch to ${p.name}`}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <Card className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="px-6 pt-5 pb-2 text-base font-bold text-brand-purple">Invoices</div>
          {INVOICES.map(([no, date]) => (
            <div key={no} className="grid grid-cols-[1.2fr_1fr_1fr_80px_120px] items-center gap-3 border-t border-line-faint px-6 py-3 text-sm">
              <span className="font-semibold">{no}</span>
              <span className="text-fg-soft">{date}</span>
              <span>{plan === 'Growth' ? 'AED 838.95' : 'AED 313.95'}</span>
              <Badge className="justify-self-start bg-brand-teal/12 px-[9px] py-[3px] text-[11px] text-teal-ink">Paid</Badge>
              <button
                type="button"
                onClick={() => showToast(`${no} downloaded`)}
                className="flex cursor-pointer items-center gap-1.5 justify-self-end border-none bg-transparent font-semibold text-brand-purple hover:text-brand-peach"
              >
                <Icon name="download" size={16} stroke={2} />
                PDF
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-[13px] text-ink-muted">
        Want to stop?{' '}
        <a href="#" className="font-semibold text-brand-purple hover:text-brand-peach">
          Cancel your plan
        </a>
        . Your listing stays live until the end of your billing month.
      </div>
    </section>
  );
}
