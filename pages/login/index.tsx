import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { InputBox } from "@/components/InputTypes";
import Link from "next/link";
import { UserDataTypes } from "@/types/types";
import { useState, useEffect } from "react";
import MANAGER from "@/hooks/useVehicle";
const Login: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [userData, setUserData] = useState<any>(null);

    const getVehicleData = async () => {
        (async () => {
            const data = await MANAGER.fetchUser(supabaseClient, user!.id);
            if (user !== null && data !== null) {
                setUserData(data);
            }
        })();
    };

    useEffect(() => {
        if (user) {
            if (userData === null) {
                getVehicleData();
            }
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        if (userData && userData.length !== 0) {
            router.push("/dashboard");
        } else {
            router.push("/onboard/" + user?.id);
        }
    }, [userData]);
    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-1/2">
                <Auth
                    appearance={{
                        theme: ThemeSupa,
                        style: {
                            button: {
                                background: "#0c0c0c",
                                color: "white",
                                border: "none",
                                fontFamily: "Poppins",
                            },
                            label: {
                                fontFamily: "Poppins",
                            },
                            input: {
                                fontFamily: "Poppins",
                            },
                            message: {
                                fontFamily: "Poppins",
                            },
                            anchor: {
                                fontFamily: "Poppins",
                            },
                            //..
                        },
                    }}
                    supabaseClient={supabaseClient}
                    providers={[]}
                />
            </div>
        </div>
    );
};

export default Login;
