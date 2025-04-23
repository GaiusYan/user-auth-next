"use client"
import { FaUser } from "react-icons/fa"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";

import {ExitIcon} from "@radix-ui/react-icons"

import { LogoutButton } from "@/components/auth/logout-button";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";

export const UserButton = () => {

    const user = useSession();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    
                    <AvatarImage src={user.data?.user?.image || ""}/>
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="h-4 w-4 mr-2"/>
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}