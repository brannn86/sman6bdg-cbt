import Label from '@/components/Label'
import PrimaryButton from '@/components/PrimaryButton'
import useAuthStore from '@/stores/auth-store'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import ProgressCircular from '@/components/ProgressCircular'
import { useTranslation } from 'next-i18next'

const UpdatePasswordForm = (): JSX.Element => {
  const { t: profileTrans } = useTranslation('profile')
  const { t: commonTrans } = useTranslation('common')

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updatePassword = useAuthStore((state) => state.updatePassword)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Password>()

  const submitForm: SubmitHandler<Password> = async (data) => {
    setIsLoading(true)
    await updatePassword(data)
    setIsLoading(false)
  }

  const password = watch('password')

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-gray-900">
          {profileTrans('password.password_information')}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {profileTrans('password.password_description')}
        </p>
      </header>
      <form onSubmit={handleSubmit(submitForm)} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="password">
            {profileTrans('password.form.new_password.label')}
          </Label>
          <input
            {...register('password', {
              required: `${profileTrans(
                'password.form.new_password.required'
              )}`,
              minLength: {
                value: 8,
                message: `${profileTrans(
                  'password.form.new_password.min_length'
                )}`
              }
            })}
            id="password"
            type="password"
            className="input-field"
            autoComplete="new_password"
          />
          <span className="text-sm text-error">{errors.password?.message}</span>
        </div>
        <div>
          <Label htmlFor="password_confirmation">
            {profileTrans('password.form.confirm_password.label')}
          </Label>
          <input
            {...register('password_confirmation', {
              required: `${profileTrans(
                'password.form.confirm_password.required'
              )}`,
              minLength: {
                value: 8,
                message: `${profileTrans(
                  'password.form.confirm_password.min_length'
                )}`
              },
              validate: (value) =>
                value === password ||
                `${profileTrans('password.form.confirm_password.match')}`
            })}
            disabled={isLoading}
            id="password_confirmation"
            type="password"
            autoComplete="password_confirmation"
            className="input-field"
          />
          <span className="text-sm text-error">
            {errors.password_confirmation?.message}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <PrimaryButton disabled={isLoading}>
            {isLoading ? <ProgressCircular /> : commonTrans('button.save')}
          </PrimaryButton>
        </div>
      </form>
    </section>
  )
}

export default UpdatePasswordForm
