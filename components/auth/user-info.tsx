import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "@/components/ui/badge";


interface userInfoProps {
    user?: ExtendedUser; 
    label: string;
}

export const UserInfo = ({
    user,
    label
}: userInfoProps) => {

    return (
        <Card>
            <CardHeader className="w-[600px] shadow-md">
                <p className="text-2xl font-semibold text-center">{label}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-meduim">
                        ID
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.id}
                    </p>
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-meduim">
                        Name
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.name}
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-meduim">
                        Email
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.email}
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-meduim">
                        Role
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.role}
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-meduim">
                        Two factor authentication
                    </p>
                    <Badge variant={user?.isTwoFactorEnabled ? "success": "destructive" }>
                        {user?.isTwoFactorEnabled ? "ON" : "OFF"} 
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
    
}