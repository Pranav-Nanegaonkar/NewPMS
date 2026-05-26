import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../app/authSlice'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import ChangePasswordForm from '../components/ChangePasswordForm'
import { userRoleColor } from '../utils/enumColors'
import { formatDate } from '../utils/format'

export default function ProfilePage() {
  const user = useAppSelector(selectCurrentUser)

  if (!user) return null

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user.fullName} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user.fullName}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge label={user.role} className={userRoleColor[user.role]} />
              {user.department && (
                <span className="text-xs text-gray-400">{user.department}</span>
              )}
            </div>
          </div>
        </div>
        {user.createdAt && (
          <p className="text-xs text-gray-400 mt-4">
            Member since {formatDate(user.createdAt)}
          </p>
        )}
      </div>

      {/* Change Password */}
      <ChangePasswordForm />
    </div>
  )
}
