import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, FileText, LayoutDashboard, MessageSquare } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
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
          </nav>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-foreground transition-colors"
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
            : 'text-gray-500 hover:text-foreground hover:bg-gray-100'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}
