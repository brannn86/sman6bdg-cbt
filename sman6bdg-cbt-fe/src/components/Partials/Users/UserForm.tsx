import React, { useEffect, useState } from 'react'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { Transition } from '@headlessui/react'
import PrimaryButton from '@/components/PrimaryButton'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { useUser } from '@/hooks/user'
import { toastHelper } from '@/helpers/toast-helper'
import { useTranslation } from 'next-i18next'

const UserForm = ({
  id: userId = null
}: {
  id?: string | null
}): JSX.Element => {
  const router = useRouter()
  const { t: commonTrans } = useTranslation('common')

  const { createUser, updateUser } = useUser()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [role, setRole] = useState('')
  const [images, setImages] = useState<File | null>(null)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [provinceId, setProvinceId] = useState('')
  const [regencyId, setRegencyId] = useState('')
  const [districtId, setDistrictId] = useState('')

  const [listRole, setListRole] = useState<any>([])
  const [listProvince, setListProvince] = useState<any>([])
  const [listRegency, setListRegency] = useState<any>([])
  const [listDistrict, setListDistrict] = useState<any>([])

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      if (userId === null || userId === undefined) return

      const user = await axios.get(`api/users/${userId}`)

      const data = user.data.data.data

      setName(data.profile.name)
      setUsername(data.username)
      setEmail(data.email)
      setRole(data.roles[0].name)
      setPhone(data.profile.phone)
      setAddress(data.profile.address)
      setPostalCode(data.profile.postal_code)
      setProvinceId(data.profile.province_id)
      setRegencyId(data.profile.regency_id)
      setDistrictId(data.profile.district_id)
    }

    fetchUser().catch((err) => {
      toastHelper.error(err)
    })
  }, [userId])

  useEffect(() => {
    const fetchRole = async (): Promise<void> => {
      const roles = await axios.get('api/roles', { params: { limit: 0 } })
      const data = roles.data.data.data
      setListRole(data.data)
    }

    fetchRole().catch((err) => {
      toastHelper.error(err)

      if (err.response.status === 404) {
        void router.replace('/users')
      }
    })
  }, [router])

  useEffect(() => {
    const fetchProvince = async (): Promise<void> => {
      const provinces = await axios.get('api/regional/provinces', {
        params: { limit: 0 }
      })
      const data = provinces.data.data.provinces

      setListProvince(data)
    }
    // fetchRole()
    fetchProvince().catch((err) => {
      toastHelper.error(err)
    })
  }, [])

  useEffect(() => {
    const fetchRegency = async (): Promise<void> => {
      if (provinceId === '') return
      const regency = await axios.get(`api/regional/regencies/${provinceId}`, {
        params: { limit: 0 }
      })
      const data = regency.data.data.regencies
      setListRegency(data)
    }
    fetchRegency().catch((err) => {
      toastHelper.error(err)
    })
  }, [provinceId])

  useEffect(() => {
    const fetchDistrict = async (): Promise<void> => {
      if (regencyId === '') return
      const district = await axios.get(`api/regional/districts/${regencyId}`, {
        params: { limit: 0 }
      })

      const data = district.data.data.districts
      setListDistrict(data)
    }
    fetchDistrict().catch((err) => {
      toastHelper.error(err)

      if (err.response.status === 404) {
        void router.replace('/users')
      }
    })
  }, [regencyId, router])

  const [errors, setErrors] = useState<{
    name?: string[]
    username?: string[]
    email?: string[]
    password?: string[]
    passwordConfirmation?: string[]
    role?: string[]
    images?: string[]
    phone?: string[]
    address?: string[]
    postalCode?: string[]
    province_id?: string[]
    regency_id?: string[]
    district_id?: string[]
  }>({})
  const [status, setStatus] = useState<any>(null)

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files == null) {
      return
    }

    const file = event.target.files[0]
    setImages(file)
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    setErrors({})
    const formData = new FormData()
    formData.append('name', name)
    formData.append('username', username)
    formData.append('email', email)

    if (images != null) {
      formData.append('images', images)
    }

    formData.append('password', password)
    formData.append('password_confirmation', passwordConfirmation)
    formData.append('role', role)
    formData.append('phone', phone)
    formData.append('address', address)
    formData.append('postal_code', postalCode)
    formData.append('province_id', provinceId ?? '')
    formData.append('regency_id', regencyId ?? '')
    formData.append('district_id', districtId ?? '')

    try {
      if (userId != null) {
        await updateUser(userId, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        setStatus('submit-success')
      } else {
        await createUser(formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      await router.push('/users')
    } catch (err: any) {
      toastHelper.error(err)
      if (err.response.status !== 422) return

      setErrors(err.response.data.data)
    }
  }
  return (
    <section>
      <header>
        <h2 className="border-b-2 border-b-slate-600 pb-2 text-lg font-medium text-gray-900 ">
          {commonTrans('form')} User
        </h2>
      </header>
      <div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            {/* Images */}
            <div>
              <Label htmlFor="images">Images</Label>
              <input
                type="file"
                className="file-input w-full max-w-xs"
                onChange={handleFileInputChange}
                accept="image/jpeg, image/png, image/jpg"
              />
              <InputError messages={errors.images} className="mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={name}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setName(event.target.value)
                }}
                required
                autoFocus
                placeholder="Name"
              />
              <InputError messages={errors.name} className="mt-2" />
            </div>
            {/* Role */}
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                className="select-bordered select mt-1 block w-full"
                onChange={(event) => {
                  setRole(event.target.value)
                }}
                value={role}
                required
                autoFocus
                disabled={role === 'developer'}
              >
                {role === 'developer' && (
                  <option value="developer">Developer</option>
                )}
                <option value="">Select Role</option>
                {listRole.map((role: any) => {
                  return (
                    <option value={role.name} key={role.id}>
                      {role.name}
                    </option>
                  )
                })}
              </select>
              <InputError messages={errors.role} className="mt-2" />
            </div>
            {/* Username */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={username}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setUsername(event.target.value)
                }}
                required
                autoFocus
                placeholder="Username"
              />
              <InputError messages={errors.username} className="mt-2" />
            </div>
            {/* Email Address */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={email}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setEmail(event.target.value)
                }}
                required
                autoFocus
                placeholder="Email"
              />

              <InputError messages={errors.email} className="mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={password}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setPassword(event.target.value)
                }}
                required={userId != null}
                autoFocus
                placeholder="Password"
              />
              <InputError messages={errors.password} className="mt-2" />
            </div>
            {/* Password Confirmation */}
            <div>
              <Label htmlFor="passwordConfirmation">
                Password Confirmation
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                name="passwordConfirmation"
                value={passwordConfirmation}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setPasswordConfirmation(event.target.value)
                }}
                required={userId != null}
                autoFocus
                placeholder="Password Confirmation"
              />
              <InputError
                messages={errors.passwordConfirmation}
                className="mt-2"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="text"
                name="phone"
                value={phone}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setPhone(event.target.value)
                }}
                autoFocus
                placeholder="Phone"
              />
              <InputError messages={errors.phone} className="mt-2" />
            </div>
            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                name="address"
                value={address}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setAddress(event.target.value)
                }}
                autoFocus
                placeholder="Address"
              />
              <InputError messages={errors.address} className="mt-2" />
            </div>
            {/* Postal Code */}
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                type="text"
                name="postalCode"
                value={postalCode}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setPostalCode(event.target.value)
                }}
                autoFocus
                placeholder="Postal Code"
              />
              <InputError messages={errors.postalCode} className="mt-2" />
            </div>
            {/* Province Id */}
            <div>
              <Label htmlFor="provinceId">Province</Label>
              <select
                id="provinceId"
                name="provinceId"
                className="select-bordered select mt-1 block w-full"
                onChange={(event) => {
                  setProvinceId(event.target.value)
                }}
                value={provinceId}
                autoFocus
              >
                <option value="">Select Province</option>
                {listProvince?.map((province: any) => {
                  return (
                    <option value={province.id} key={province.id}>
                      {province.name}
                    </option>
                  )
                })}
              </select>
              <InputError messages={errors.province_id} className="mt-2" />
            </div>
            {/* Regency Id */}
            <div>
              <Label htmlFor="regencyId">Regency</Label>
              <select
                id="regencyId"
                name="regencyId"
                className="select-bordered select mt-1 block w-full"
                onChange={(event) => {
                  setRegencyId(event.target.value)
                }}
                value={regencyId}
                autoFocus
              >
                <option value="">Select Regency</option>
                {listRegency?.map((regency: any) => {
                  return (
                    <option value={regency.id} key={regency.id}>
                      {regency.name}
                    </option>
                  )
                })}
              </select>
              <InputError messages={errors.regency_id} className="mt-2" />
            </div>
            {/* District Id */}
            <div>
              <Label htmlFor="districtId">District</Label>
              <select
                id="districtId"
                name="districtId"
                className="select-bordered select mt-1 block w-full"
                onChange={(event) => {
                  setDistrictId(event.target.value)
                }}
                value={districtId}
                autoFocus
              >
                <option value="">Select District</option>
                {listDistrict?.map((district: any) => {
                  return (
                    <option value={district.id} key={district.id}>
                      {district.name}
                    </option>
                  )
                })}
              </select>
              <InputError messages={errors.district_id} className="mt-2" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <PrimaryButton>{commonTrans('save')}</PrimaryButton>

            {status === 'submit-success' && (
              <Transition
                show={true}
                enterFrom="opacity-0"
                leaveTo="opacity-0"
                className="transition ease-in-out"
              >
                <p className="text-sm text-gray-600">Saved.</p>
              </Transition>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

export default UserForm
