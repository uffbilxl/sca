import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-52px)]">
      <AdminSidebar />
      <main className="flex-1 bg-[var(--bg)] p-7 overflow-auto">{children}</main>
    </div>
  )
}
