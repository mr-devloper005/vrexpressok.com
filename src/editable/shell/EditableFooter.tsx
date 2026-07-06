'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-white text-[#071421]">
      <div className="mx-auto flex min-h-[360px] max-w-[var(--editable-container)] flex-col items-center justify-end px-4 pb-7 pt-20 text-center sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/about" className="hover:text-[var(--slot4-accent)]">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-[var(--slot4-accent)]">Contact Us</Link>
          <Link href="/search" className="hover:text-[var(--slot4-accent)]">Cookies</Link>
          {session ? <button type="button" onClick={logout} className="hover:text-[var(--slot4-accent)]">Logout</button> : null}
        </div>
        <p className="mt-3 text-xs text-[#8a95a1]">Copyright &copy; {year} {SITE_CONFIG.name}</p>
        <p className="mt-1 text-sm text-[#8a95a1]">Powered by Community</p>
      </div>
    </footer>
  )
}
