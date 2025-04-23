import { UserInfo } from '@/components/auth/user-info';
import { currentUser } from '@/lib/auth'
import React from 'react'

const ClientPage = async () => {
    const user = await currentUser();
  return (
        <UserInfo user={user} label="📱 Client component"></UserInfo>
    )
}

export default ClientPage
