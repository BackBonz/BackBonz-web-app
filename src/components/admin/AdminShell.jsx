import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, FileText, LayoutDashboard, MessageSquare, HelpCircle, Settings, Sticker } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { useToast } from './Toast'

export function AdminShell({ children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/admin/login', { replace: true })
    } catch {
      toast({ message: 'Sign-out failed. Try again.', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-divider sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link to="/admin" className="font-display font-bold text-denim text-lg tracking-tight">
            BackBonz Admin
          </Link>

          <nav className="flex items-center gap-1">
            <AdminNavLink to="/admin" end icon={<LayoutDashboard size={15} />}>
              Dashboard
            </AdminNavLink>
            <AdminNavLink to="/admin/documents" icon={<FileText size={15} />}>
              Documents
            </AdminNavLink>
            <AdminNavLink to="/admin/messages" icon={<MessageSquare size={15} />}>
              Messages
            </AdminNavLink>
            <AdminNavLink to="/admin/faq" icon={<HelpCircle size={15} />}>
              FAQ
            </AdminNavLink>
            <AdminNavLink to="/admin/stickers" icon={<Sticker size={15} />}>
              Stickers
            </AdminNavLink>
            <AdminNavLink to="/admin/settings" icon={<Settings size={15} />}>
              Settings
            </AdminNavLink>
          </nav>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-foreground-tertiary hover:text-foreground transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  )
}

function AdminNavLink({ to, end, icon, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-denim/10 text-denim'
            : 'text-foreground-tertiary hover:text-foreground hover:bg-rebel-pink-100/50'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}
