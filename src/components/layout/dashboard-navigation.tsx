'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const primaryNavigation = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/interviews/new', label: 'Practice', icon: '✦' },
  { href: '/history', label: 'History', icon: '◷' },
];

const secondaryNavigation = [
  { href: '/analytics', label: 'Progress', description: 'Scores and performance trends' },
  { href: '/profile', label: 'Profile', description: 'Career goals and account details' },
  { href: '/settings', label: 'Settings', description: 'Preferences and interview options' },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
}

export function DesktopNavigation() {
  const pathname = usePathname();
  const items = [
    ...primaryNavigation,
    ...secondaryNavigation.map(({ href, label }) => ({ href, label, icon: '•' })),
  ];

  return (
    <nav aria-label="Dashboard navigation" className="mt-9 space-y-2">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <section
            aria-label="More navigation options"
            className="absolute bottom-20 left-4 right-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between px-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">More</p>
                <h2 className="mt-1 text-xl font-extrabold">Your workspace</h2>
              </div>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl">×</button>
            </div>
            <div className="space-y-2">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl border border-slate-200 p-4 transition active:scale-[0.99] hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <p className="font-bold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {primaryNavigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={`rounded-2xl px-2 py-2 text-center text-xs font-bold transition ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}>
                <span className={`mx-auto mb-1 grid h-8 w-8 place-items-center rounded-xl text-lg ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100'}`} aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <button onClick={() => setOpen(true)} className={`rounded-2xl px-2 py-2 text-center text-xs font-bold ${open ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}>
            <span className={`mx-auto mb-1 grid h-8 w-8 place-items-center rounded-xl text-lg ${open ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100'}`} aria-hidden>•••</span>
            More
          </button>
        </div>
      </nav>
    </>
  );
}
