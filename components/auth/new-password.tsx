"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { newPassword } from "@/actions/new-password";


export const NewPasswordForm = () => {
  
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    })  


    const onSubmit = (values : z.infer<typeof NewPasswordSchema>) => {
        setError("");
        setSuccess("");

        console.log(values);
        
        startTransition(() => {
            newPassword(values,token)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }

    return ( 
        <CardWrapper 
            headerLabel="Enter a new password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login" 
           >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"

                        >
                            <div className="space-y-4">
                                <FormField 
                                    control={form.control}
                                    name={"password"}
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="password"
                                                placeholder="******"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                    )}
                                />
                               
                            </div>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Button type="submit"
                            disabled={isPending} 
                            className="w-full">
                            Reset password
                        </Button>
                    </form>
                </Form>
        </CardWrapper>
    );
}
 
