import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⊞' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/users', label: 'Users', icon: '👥' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 bg-[#0052CC] flex flex-col flex-shrink-0 min-h-screen">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-blue-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
            <span className="text-[#0052CC] font-bold text-sm">P</span>
          </div>
          <span className="text-white font-bold text-base tracking-wide">PMS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-blue-700">
        <p className="text-blue-300 text-xs">Project Management System</p>
      </div>
    </aside>
  )
}
