'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Search, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const primaryLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-white/95 text-[#213040] shadow-[0_1px_12px_rgba(8,20,34,0.07)] backdrop-blur-md">
      <div className="h-[3px] bg-[var(--slot4-accent)]" />

      <nav className="mx-auto flex min-h-[68px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-h-[68px] shrink-0 items-center border-r border-[var(--editable-border)] pr-7">
          <span className="editable-display text-3xl font-black leading-none tracking-[-0.05em] text-[#26364b]">
            {SITE_CONFIG.name.replace(/^www\./, '').replace('.com', '')}
            <span className="ml-1 rounded-full bg-[var(--slot4-accent)] px-1.5 py-0.5 align-middle text-[10px] font-extrabold tracking-normal text-white">.com</span>
          </span>
        </Link>

        <div className="hidden min-h-[68px] items-stretch lg:flex">
          {primaryLinks.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center px-4 text-sm font-bold transition ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[#62717f] hover:text-[#213040]'
                }`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-4 bottom-0 h-[2px] bg-[var(--slot4-accent)]" /> : null}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="ml-auto hidden min-w-0 flex-1 justify-end md:flex">
          <label className="flex h-10 w-full max-w-[278px] items-center gap-2 rounded-md border border-[#d8dde3] bg-white px-4 shadow-[0_2px_12px_rgba(10,20,30,0.08)] transition focus-within:border-[var(--slot4-accent)]">
            <input
              name="q"
              type="search"
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#222]"
            />
            <Search className="h-4 w-4 shrink-0 text-[#b6bdc4]" />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 border border-[var(--slot4-accent)] bg-[var(--editable-cta-bg)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--editable-cta-text)] transition hover:opacity-90 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1 px-3 py-2 text-sm font-extrabold text-[#213040] transition hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                Existing user? Sign In <ChevronDown className="h-3 w-3" />
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded bg-[var(--editable-cta-bg)] px-6 py-3 text-sm font-extrabold text-white transition hover:brightness-95 sm:inline-flex"
              >
                Sign Up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded border border-[var(--editable-border)] bg-white p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="h-px bg-[var(--editable-border)]" />

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 rounded border border-[var(--editable-border)] bg-white px-3 py-2">
            <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
            <input name="q" type="search" placeholder="Search posts" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
          </form>
          <div className="grid gap-1">
            {[...primaryLinks, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                    active
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/40 hover:bg-[var(--slot4-surface-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </header>
  )
}
