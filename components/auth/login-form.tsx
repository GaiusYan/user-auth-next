"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
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
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import Link from "next/link";

export const LoginForm = () => {
    const searchParams  = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
     ? "Email already in use with different provider!" : "";
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })  


    const onSubmit = (values : z.infer<typeof loginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values)
            .then((data) => {
                
                if (data?.error) {
                    form.reset();
                    setError(data?.error);
                    return;
                }

                if (data?.success){
                    form.reset();
                    setSuccess(data?.success);
                }

                if (data?.twoFactorToken) {
                    setShowTwoFactor(true);
                }
            })
            .catch(() => {
                setError("Something went wrong");
            })
        })
    }

    return ( 
        <CardWrapper 
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account? Sign up"
            backButtonHref="/auth/register" 
            showSocial={true}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"

                        >
                            <div className="space-y-4">
                                {showTwoFactor && (
                                    <>
                                        <FormField 
                                            control={form.control}
                                            name={"code"}
                                            render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Two factor code</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="123456"/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {!showTwoFactor &&
                                <>    
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
                                            <Button 
                                                size={"sm"} 
                                                variant={"link"}
                                                asChild={true}
                                                className="px-0 font-normal">
                                                <Link 
                                                    href="/auth/reset">
                                                    Forgot password ?
                                                </Link>
                                            </Button>
                                            <FormMessage/>
                                        </FormItem>
                                        )}
                                    />
                                </>
                                }
                            </div>
                        <FormError message={error || urlError}/>
                        <FormSuccess message={success}/>
                        <Button type="submit"
                            disabled={isPending} 
                            className="w-full">
                            {showTwoFactor ? "Confirm" : "Connexion"}
                        </Button>
                    </form>
                </Form>
        </CardWrapper>
    );
}
 
