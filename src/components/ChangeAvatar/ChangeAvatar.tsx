import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { getProfile } from '../../hooks/useProfile'
import { uploadAvatar } from '../../hooks/useAvatar'

import Avatar from '../../layout/Avatar/Avatar'
import LoadSpinner from '../../layout/LoadSpinner/LoadSpinner'

export default function ChangeAvatar() {
  const { currentUser } = useAuth()
  const [date, setDate] = useState<number>(Date.now())

  const refreshAvatar = () => {
    // Changes a parameter in the avatar url to force a reload of the image
    setDate(Date.now())
  }

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', currentUser?.id],
    queryFn: async () => await getProfile(currentUser?.id ?? '')
  })

  const { mutate: handleUpload } = useMutation({
    mutationFn: async (file: File) =>
      await uploadAvatar({
        id: currentUser?.id ?? '',
        avatar: file
      }),
    onSuccess: () => refreshAvatar()
  })

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    handleUpload(file)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mt-5">
      <div className="flex flex-wrap items-center gap-4">
        {isProfileLoading && <LoadSpinner />}
        {profile && (
          <div className="relative overflow-hidden rounded-full w-fit group">
            <div className="transition group-hover:brightness-50">
              <Avatar
                avatarUrl={`${profile?.avatar_url ?? ''}?${date}`}
                size={'medium'}
                name={profile.email}
              />
            </div>
            <div className="absolute font-bold text-white transition -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer group-hover:opacity-100 top-1/2 left-1/2">
              <img src="/camera.svg" alt="Upload avatar" />
            </div>
            <input
              onChange={handleChangeAvatar}
              type="file"
              name="avatar"
              accept="image/*"
              className="absolute top-0 left-0 z-10 w-full h-full opacity-0"
              title=""
            />
          </div>
        )}
      </div>
      <span className="font-semibold break-all">{currentUser?.email}</span>
    </div>
  )
}