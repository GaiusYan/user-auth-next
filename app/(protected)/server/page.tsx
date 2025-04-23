import { UserInfo } from "@/components/auth/user-info";
import { currentUser } from "@/lib/auth";

const ServerPage = async () =>{

    const session = await currentUser();
    return (
        <UserInfo user={session} label="💻 Server component"></UserInfo>
    )
}

export default ServerPage;
