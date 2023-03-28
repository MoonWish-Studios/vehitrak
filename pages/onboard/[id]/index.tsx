import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { supabase, ThemeSupa } from "@supabase/auth-ui-shared";
import { InputBox } from "@/components/InputTypes";
import { useState, useEffect } from "react";
import { UserDataTypes } from "@/types/types";

const USER_DATA_INITIAL_STATE = {
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    business_name: "",
};
const Onboard: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.id as string;
            if (id !== null)
                setUserData((prev) => ({
                    ...prev,
                    id: id,
                    email: user?.email,
                }));
        }
    }, [router]);

    const [userData, setUserData] = useState<UserDataTypes>(
        USER_DATA_INITIAL_STATE
    );

    const handleChange = (e: any) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const createUser = async () => {
        try {
            const { error } = await supabaseClient
                .from("users")
                .insert(userData);
            if (!error) {
                router.push("/dashboard");
            } else {
                console.log(error);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="">
                <InputBox
                    label="First Name"
                    name="first_name"
                    placeholder="John"
                    type="text"
                    statusCompleted={userData.first_name ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="Last Name"
                    name="last_name"
                    placeholder="Doe"
                    type="text"
                    statusCompleted={userData.last_name ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="Company Name"
                    name="business_name"
                    placeholder="Moonwish Studios"
                    type="text"
                    statusCompleted={userData.business_name ? true : false}
                    handleChange={handleChange}
                />
                <button className="btn mt-4 btn-primary" onClick={createUser}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default Onboard;
