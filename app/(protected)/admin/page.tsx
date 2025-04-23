"use client"
import { Card } from '@/components/ui/card';
import { useCurrentRole } from '@/hooks/use-current-role'
import React from 'react'

const AdminPage = () => {

    const role = useCurrentRole();
  return (
    <Card className='w-[600px]'>
      <p className='text-bold text-semibold text-center'>Admin</p>
    </Card>
  )
}

export default AdminPage
