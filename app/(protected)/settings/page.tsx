"use client";

import * as z from "zod";   
import {useForm} from "react-hook-form";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"
import { useTransition,useState } from "react";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "@/hooks/use-current-user";

import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectValue,
    SelectTrigger
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
const SettingsPage =  () => {

    const user = useCurrentUser();

    const [error,setError] = useState<string | undefined>();
    const [success,setSuccess] = useState<string | undefined>();

    const [isPending, startTransition] = useTransition();



    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: user?.name || undefined,
            email: user?.email || undefined,
            role: user?.role || undefined
        }
    });


    const onSubmit = (values : z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values).then((data) => {
                
                if (data.error) {
                    setError(data.error);
                }

                if (data.success) {
                    setSuccess(data.success);
                }
            }).catch(() => {
                setError("Something went wrong");
            })
        })
    }
    

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Settings
                </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6"
                 onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="John Doe"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="johndoe@gmail.com"
                                            disabled={isPending}
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            disabled={isPending}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            disabled={isPending}
                                            type="password"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select 
                                        name="role"
                                        disabled={isPending}
                                        defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role"></SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                                <SelectItem value={UserRole.USER}>User</SelectItem>
                                            </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                <FormError message={error as string}/>
                <FormSuccess message={success as string}/>
                    <Button type="submit">
                        Save
                    </Button>
                </form>
              </Form>
            </CardContent>
        </Card>
    );
}

export default SettingsPage;