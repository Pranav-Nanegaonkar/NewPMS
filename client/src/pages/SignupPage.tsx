import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSignupMutation } from '../api/authApi'
import { setCredentials } from '../app/authSlice'
import { useAppDispatch } from '../app/hooks'
import { tokenStorage } from '../utils/tokenStorage'
import type { SignupRequest, UserRole } from '../types'

// ─── Password Strength ────────────────────────────────────────────────────────

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (!password) return { label: '', color: 'bg-gray-200', width: 'w-0' }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[@$!%*?&]/.test(password)) score++

  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' }
  if (score <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' }
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
}

// ─── Form Types ───────────────────────────────────────────────────────────────

interface SignupFormData extends SignupRequest {
  confirmPassword: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const [watchedPassword, setWatchedPassword] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', role: 'DEVELOPER', department: '' },
  })

  const password = watch('password', '')
  const strength = getPasswordStrength(password)

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null)
    if (data.password !== data.confirmPassword) {
      setServerError('Passwords do not match')
      return
    }
    try {
      const result = await signup({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
        department: data.department,
      }).unwrap()

      tokenStorage.save(result.data.token, true)
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }))
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      setServerError(error?.data?.message ?? 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <span className="text-white text-xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-500 mt-1">Join your team on PMS</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'At least 2 characters' },
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' },
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                {...register('role', { required: true })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DEVELOPER">Developer</option>
                <option value="TESTER">Tester</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                {...register('department')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Engineering"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Min 8 chars with uppercase, lowercase, digit & special character',
                  },
                  onChange: (e) => setWatchedPassword(e.target.value),
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {/* Strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-xs mt-1 ${
                    strength.label === 'Strong' ? 'text-green-600' :
                    strength.label === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {strength.label} password
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === watch('password') || 'Passwords do not match',
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
