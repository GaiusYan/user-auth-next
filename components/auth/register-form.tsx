"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";
import { useState, useTransition } from "react";

export const RegisterForm = () => {
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        },
    })  


    const onSubmit = (values : z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values)
            .then((data) => {
                setError(data.error);
                setSuccess(data.success);
            })
        })
    }

    return ( 
        <CardWrapper 
            headerLabel="Create an account"
            backButtonLabel="Already have an account"
            backButtonHref="/auth/login" 
            showSocial={true}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"

                        >
                            <div className="space-y-4">
                                <FormField 
                                    control={form.control}
                                    name={"email"}
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="email"
                                                placeholder="yancode@gmail.com"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                    )}
                                />
                                <FormField 
                                    control={form.control}
                                    name={"name"}
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="string"
                                                placeholder="Gaius Yan"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                    )}
                                />
                                <FormField 
                                    control={form.control}
                                    name={"password"}
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
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
                            Create Account
                        </Button>
                    </form>
                </Form>
        </CardWrapper>
    );
}
 
