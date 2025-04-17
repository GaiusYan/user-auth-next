"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { CardWrapper } from './card-wrapper'
import { BeatLoader} from "react-spinners";
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/actions/new-verification';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
function NewVerificationForm() {
  
    const [error,setError] = useState<string | undefined>();
    const [succes,setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (succes || error) return;

        if (!token){
            setError("Token not found");
            return;
        }
        newVerification(token).then((data) => {
            setError(data?.error);
            setSuccess(data?.success);
        }).catch(() => {
            setError("Something went wrong");
        });
    },[token,succes,error]);


    useEffect(() => {
        onSubmit();
    },[onSubmit]);
    return (
    <CardWrapper
    headerLabel='Confirm your verification'
    backButtonHref='/auth/login'
    backButtonLabel='Back to login'
    >
        <div className='flex items-center w-full justify-center'>
            {!succes && !error && (
                <BeatLoader/>
            )}
            <FormSuccess message={succes}/>
            {!succes && (
                <FormError message={error}/>
            )}
        </div>
    </CardWrapper>
  )
}

export default NewVerificationForm
