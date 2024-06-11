import { useEffect, useState } from 'react'
import Label from '@/components/Label'
import PrimaryButton from '@/components/PrimaryButton'
import useAuthStore from '@/stores/auth-store'
import { shallow } from 'zustand/shallow'
import { type SubmitHandler, useForm } from 'react-hook-form'

import useRegionStore from '@/stores/region-store'
import DisabledComboBox from './DisabledComboBox'
import ProgressCircular from '@/components/ProgressCircular'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

const UpdateProfileInformationForm = (): JSX.Element => {
  const { t: profileTrans } = useTranslation('profile')
  const { t: commonTrans } = useTranslation('common')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pickedImage, setPickedImage] = useState<string | null>(null)

  const [user, updateUser] = useAuthStore(
    (state) => [state.user, state.updateUser],
    shallow
  )
  const [
    provinces,
    regencies,
    districts,
    getProvinces,
    getRegencies,
    getDistricts,
    resetDistricts
  ] = useRegionStore(
    (state) => [
      state.provinces,
      state.regencies,
      state.districts,
      state.getProvinces,
      state.getRegencies,
      state.getDistricts,
      state.resetDistricts
    ],
    shallow
  )

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm<User>({
    defaultValues: user ?? undefined
  })

  useEffect(() => {
    void getProvinces()

    if (
      user?.profile?.province?.id !== null &&
      user?.profile?.province?.id !== undefined
    )
      void getRegencies(user.profile.province.id)

    if (
      user?.profile?.regency?.id !== null &&
      user?.profile?.regency?.id !== undefined
    )
      void getDistricts(user.profile.regency.id)
  }, [getDistricts, getProvinces, getRegencies, user])

  const submitForm: SubmitHandler<User> = async (data): Promise<void> => {
    setIsLoading(true)

    const file = data.profile?.images_local?.[0]

    if (
      file?.type !== 'image/jpeg' &&
      file?.type !== 'image/png' &&
      file?.type !== 'image/jpg'
    ) {
      setError('profile.images_local', {
        type: 'filetype',
        message: ` ${profileTrans('profile.form.photo.file_type')}`
      })
      setIsLoading(false)
      return
    }

    if (file?.size > 1024 * 1024 * 4) {
      setError('profile.images_local', {
        type: 'filesize',
        message: `${profileTrans('profile.form.photo.file_size')}`
      })
      setIsLoading(false)
      return
    }

    await updateUser(data)
    setIsLoading(false)
  }

  const tmpImg = watch('profile.images_local')

  useEffect(() => {
    if (tmpImg !== undefined && tmpImg !== null && tmpImg.length > 0) {
      setPickedImage(URL.createObjectURL(tmpImg[0]))
    }
  }, [tmpImg, user])

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-gray-900 ">
          {profileTrans('profile.profile_information')}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {profileTrans('profile.profile_description')}
        </p>
      </header>
      <form onSubmit={handleSubmit(submitForm)} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="photo">
            {profileTrans('profile.form.photo.label')}
          </Label>
          <div className="mt-4 flex items-center">
            <div>
              <Image
                width={128}
                height={128}
                priority
                className="aspect-square rounded-full object-cover"
                src={
                  pickedImage ??
                  user?.profile?.image_path ??
                  '/assets/images/user.png'
                }
                alt="Profile"
              />
            </div>
            <div className="ml-4">
              <input
                {...register('profile.images_local')}
                id="photo"
                type="file"
                accept="image/*"
              />
            </div>
          </div>
          <span className="text-sm text-error">
            {errors.profile?.images_local?.message}
          </span>
        </div>
        <div>
          <Label htmlFor="name">
            {profileTrans('profile.form.name.label')}
          </Label>
          <input
            {...register('profile.name', {
              required: `${profileTrans('profile.form.name.required')}`
            })}
            id="name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="text-sm text-error">
            {errors.profile?.name?.message}
          </span>
        </div>
        <div>
          <Label htmlFor="username">
            {profileTrans('profile.form.username.label')}
          </Label>
          <input
            {...register('username', {
              required: `${profileTrans('profile.form.username.required')}`,
              minLength: {
                value: 6,
                message: `${profileTrans('profile.form.username.min_length')}`
              },
              pattern: {
                value:
                  /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
                message: `${profileTrans('profile.form.username.pattern')}`
              }
            })}
            id="username"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="text-sm text-error">{errors.username?.message}</span>
        </div>
        <div>
          <Label htmlFor="email">
            {profileTrans('profile.form.email.label')}
          </Label>
          <input
            {...register('email', {
              required: `${profileTrans('profile.form.email.required')}`,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: `${profileTrans('profile.form.email.pattern')}`
              }
            })}
            id="email"
            type="email"
            name="email"
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="text-sm text-error">{errors.email?.message}</span>
        </div>
        <div>
          <Label htmlFor="phone">
            {profileTrans('profile.form.phone.label')}
          </Label>
          <input
            {...register('profile.phone', {
              pattern: {
                value: /^[0-9]+$/i,
                message: `${profileTrans('profile.form.phone.pattern')}`
              },
              minLength: {
                value: 10,
                message: `${profileTrans('profile.form.phone.min_length')}`
              },
              maxLength: {
                value: 13,
                message: `${profileTrans('profile.form.phone.max_length')}`
              }
            })}
            id="phone"
            type="tel"
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="text-sm text-error">
            {errors.profile?.phone?.message}
          </span>
        </div>
        <div>
          <Label htmlFor="province">
            {profileTrans('profile.form.province.label')}
          </Label>
          {isLoading || provinces.isLoading || provinces.data.length === 0 ? (
            <DisabledComboBox
              text={profileTrans('profile.form.province.placeholder')}
            />
          ) : (
            <select
              {...register('profile.province.id')}
              onChange={(e) => {
                resetDistricts()
                void getRegencies(parseInt(e.target.value))
              }}
              id="province"
              className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option disabled>
                {profileTrans('profile.form.province.placeholder')}
              </option>
              {provinces.data.map((province) => (
                <option key={province.id} value={province.id ?? undefined}>
                  {province.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <Label htmlFor="regency">
            {profileTrans('profile.form.regency.label')}
          </Label>
          {isLoading || regencies.isLoading || regencies.data.length === 0 ? (
            <DisabledComboBox
              text={profileTrans('profile.form.regency.placeholder')}
            />
          ) : (
            <select
              {...register('profile.regency.id')}
              onChange={(e) => {
                void getDistricts(parseInt(e.target.value))
              }}
              id="regency"
              className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option disabled>
                {profileTrans('profile.form.regency.placeholder')}
              </option>
              {regencies.data.map((regency) => (
                <option key={regency.id} value={regency.id ?? undefined}>
                  {regency.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <Label htmlFor="district">
            {profileTrans('profile.form.district.label')}
          </Label>
          {isLoading || districts.isLoading || districts.data.length === 0 ? (
            <DisabledComboBox
              text={profileTrans('profile.form.district.placeholder')}
            />
          ) : (
            <select
              {...register('profile.district.id')}
              id="district"
              className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option disabled>
                {profileTrans('profile.form.district.placeholder')}
              </option>
              {districts.data.map((district) => (
                <option key={district.id} value={district.id ?? undefined}>
                  {district.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <Label htmlFor="address">
            {profileTrans('profile.form.address.label')}
          </Label>
          <input
            {...register('profile.address')}
            id="address"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <Label htmlFor="postal">
            {profileTrans('profile.form.postal_code.label')}
          </Label>
          <input
            {...register('profile.postal_code')}
            id="postal"
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <PrimaryButton disabled={isLoading}>
            {isLoading ? <ProgressCircular /> : commonTrans('save')}
          </PrimaryButton>
        </div>
      </form>
    </section>
  )
}

export default UpdateProfileInformationForm
