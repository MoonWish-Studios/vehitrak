import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { InputBox } from "../form/[id]";
import Link from "next/link";
import { UserDataTypes } from "@/types/types";
import { useState, useEffect } from "react";

const Login: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [userData, setUserData] = useState<any>(null);

    const getVehicleData = async () => {
        console.log(user?.id);
        try {
            const { data, error } = await supabaseClient
                .from("users")
                .select("*")
                .eq("id", user?.id);

            console.log("getting user data and setting it");

            if (user !== null && data !== null) {
                setUserData(data as any as null);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            if (userData === null) {
                console.log("AM I CALLED");
                getVehicleData();
            }
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        if (userData && userData.length !== 0) {
            console.log("hihi", userData);
            router.push("/dashboard/" + user?.id);
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
                                fontFamily: "Outfit",
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
