'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const nav = [
  { section: 'Overview', items: [
    { href: '/admin', label: 'Dashboard', icon: '▣' },
  ]},
  { section: 'Opportunities', items: [
    { href: '/admin/opportunities', label: 'All Opportunities', icon: '◉' },
    { href: '/admin/opportunities/import', label: 'Import CSV', icon: '⇪' },
  ]},
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-[200px] flex-shrink-0 border-r border-[var(--b1)] bg-[var(--bg2)] py-4 sticky top-[52px] self-start h-[calc(100vh-52px)] overflow-y-auto flex flex-col">
      <div className="flex-1">
        {nav.map(group => (
          <div key={group.section}>
            <div className="px-4 pt-4 pb-1 text-[9px] font-semibold text-[var(--t4)] uppercase tracking-widest">{group.section}</div>
            {group.items.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-[12px] transition-colors ${
                    active ? 'text-[var(--t1)] bg-[var(--bg3)]' : 'text-[var(--t3)] hover:text-[var(--t2)] hover:bg-[var(--bg3)]'
                  }`}
                >
                  <span className="text-[13px]">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--b1)] pt-2">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 text-[12px] text-[var(--t3)] hover:text-[var(--t2)] hover:bg-[var(--bg3)] transition-colors">
          ← Back to site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-[12px] text-[var(--t4)] hover:text-red-400 hover:bg-[var(--bg3)] transition-colors w-full text-left"
        >
          ⎋ Logout
        </button>
      </div>
    </aside>
  )
}
