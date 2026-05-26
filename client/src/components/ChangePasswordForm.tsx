import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useChangePasswordMutation } from '../api/authApi'
import type { ChangePasswordRequest } from '../types'

interface FormData extends ChangePasswordRequest {
  confirmPassword: string
}

export default function ChangePasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    setSuccess(false)
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap()
      setSuccess(true)
      reset()
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      setServerError(error?.data?.message ?? 'Failed to change password')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Change Password</h3>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          Password changed successfully!
        </div>
      )}
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            {...register('currentPassword', { required: 'Current password is required' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            {...register('newPassword', {
              required: 'New password is required',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'Min 8 chars with uppercase, lowercase, digit & special character',
              },
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: (val) => val === watch('newPassword') || 'Passwords do not match',
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
