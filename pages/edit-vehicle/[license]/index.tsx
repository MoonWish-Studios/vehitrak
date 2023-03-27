import type { NextPage, GetServerSidePropsContext } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { supabase, ThemeSupa } from "@supabase/auth-ui-shared";
import { InputBox } from "@/components/InputTypes";
import { useState, useEffect } from "react";
import { VehicleDataTypes } from "@/types/types";
import {
    createServerSupabaseClient,
    User,
} from "@supabase/auth-helpers-nextjs";
import MANAGER from "@/hooks/useVehicle";
const VEHICLE_DATA_INITIAL_STATE = {
    owner_id: "",
    make: "",
    model: "",
    year: 0,
    license: "",
    vin: "",
    mileage_last_serviced: 0,
    date_last_serviced: new Date(),
};
const EditVehicle: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [license, setLicense] = useState<string | null>(null);
    useEffect(() => {
        if (router.isReady) {
            const license = router.query.license as string;
            setLicense(license);
        }
    }, [router]);

    const [vehicleData, setVehicleData] = useState<VehicleDataTypes>(
        VEHICLE_DATA_INITIAL_STATE
    );

    useEffect(() => {
        if (!license) return;
        (async () => {
            const data = await MANAGER.fetchVehicleByLicense(
                supabaseClient,
                license
            );
            setVehicleData(data);
        })();
    }, [license]);

    // useEffect(() => {}, [data]);
    const handleChange = (e: any) => {
        setVehicleData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const saveChanges = async () => {
        try {
            const { error } = await supabaseClient
                .from("vehicles")
                .update(vehicleData)
                .eq("license", license);
            if (!error) {
                router.push("/dashboard/vehicle/" + license);
            } else {
            }
        } catch (error: any) {
            alert(error.message);
        }
    };
    return (
        <div className="w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <InputBox
                    label="Make"
                    name="make"
                    initialValue={vehicleData.make}
                    placeholder={"Toyota"}
                    type="text"
                    statusCompleted={vehicleData.make ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="Model"
                    name="model"
                    placeholder={"Camry"}
                    initialValue={vehicleData.model}
                    type="text"
                    statusCompleted={vehicleData.model ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="Year"
                    name="year"
                    placeholder={"2020"}
                    initialValue={vehicleData.year as any}
                    type="number"
                    statusCompleted={vehicleData.year ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="License Plate"
                    name="license"
                    placeholder={"SAM123"}
                    initialValue={vehicleData.license}
                    type="text"
                    statusCompleted={vehicleData.license ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="VIN"
                    name="vin"
                    placeholder={"examplevin123"}
                    initialValue={vehicleData.vin}
                    type={vehicleData.license}
                    statusCompleted={vehicleData.vin ? true : false}
                    handleChange={handleChange}
                />

                <InputBox
                    label="Mileage Last Serviced At"
                    name="mileage_last_serviced"
                    initialValue={vehicleData.mileage_last_serviced.toString()}
                    placeholder={"12000"}
                    type="number"
                    statusCompleted={
                        vehicleData.mileage_last_serviced ? true : false
                    }
                    handleChange={handleChange}
                />
                <InputBox
                    label="Date Last Serviced"
                    name="date_last_serviced"
                    initialValue={vehicleData.date_last_serviced.toString()}
                    placeholder="27-11-2022"
                    type="date"
                    statusCompleted={
                        vehicleData.date_last_serviced ? true : false
                    }
                    handleChange={handleChange}
                />
                <button className="btn mt-5 w-full" onClick={saveChanges}>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditVehicle;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx);
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session)
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };

    return {
        props: {
            initialSession: session,
            user: session.user,
        },
    };
};
