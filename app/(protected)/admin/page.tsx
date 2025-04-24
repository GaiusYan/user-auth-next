"use client"
import { RoleGate } from '@/components/auth/role-gat';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserRole } from '@prisma/client';
import React from 'react'

const AdminPage = () => {

  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if(response.ok) {
        console.log('API route is accessible');
      } else {
        console.error('API route is not accessible');
      }
    })
  }

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl text-semibold text-center'>Admin</p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess
            message='You are allowed to see this content'
          />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className='text-sm font-meduim'>
            Admin-only API route 
          </p>
          <Button onClick={onApiRouteClick}>
            Click to test
          </Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className='text-sm font-meduim'>
            Admin-only API server action 
          </p>
          <Button>
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage
