import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout, selectCurrentUser } from '../../app/authSlice'
import { tokenStorage } from '../../utils/tokenStorage'
import Avatar from '../Avatar'
import Badge from '../Badge'
import { userRoleColor } from '../../utils/enumColors'

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectCurrentUser)
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    tokenStorage.remove()
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div />
      <div className="flex items-center gap-3 relative">
        {currentUser && (
          <>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
            >
              <Avatar name={currentUser.fullName} size="sm" />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">{currentUser.fullName}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <Badge label={currentUser.role} className={`${userRoleColor[currentUser.role]} text-xs hidden sm:inline-flex`} />
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMenu && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                {/* Dropdown */}
                <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  <a
                    href="/profile"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </header>
  )
}
