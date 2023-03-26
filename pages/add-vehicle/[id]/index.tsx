import type { NextPage, GetServerSidePropsContext } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { supabase, ThemeSupa } from "@supabase/auth-ui-shared";
import { InputBox } from "../../form/[id]";
import { useState, useEffect } from "react";
import { VehicleDataTypes } from "@/types/types";
import {
    createServerSupabaseClient,
    User,
} from "@supabase/auth-helpers-nextjs";

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
const AddVehicle: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.id as string;
            if (id !== null)
                setVehicleData((prev) => ({
                    ...prev,
                    owner_id: id,
                }));
        }
    }, [router]);

    const [vehicleData, setVehicleData] = useState<VehicleDataTypes>(
        VEHICLE_DATA_INITIAL_STATE
    );

    const handleChange = (e: any) => {
        setVehicleData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const addVehicle = async () => {
        try {
            const { error } = await supabaseClient
                .from("vehicles")
                .insert(vehicleData);
            if (!error) {
                router.push("/dashboard/" + user?.id);
            } else {
                console.log(error);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-1/2">
                <InputBox
                    label="Make"
                    name="make"
                    placeholder={"Toyota"}
                    type="text"
                    statusCompleted={vehicleData.make ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="Model"
                    name="model"
                    placeholder="Camry"
                    type="text"
                    statusCompleted={vehicleData.model ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="Year"
                    name="year"
                    placeholder="2022"
                    type="number"
                    statusCompleted={vehicleData.year ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="License Plate"
                    name="license"
                    placeholder="6SAM123"
                    type="text"
                    statusCompleted={vehicleData.license ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="VIN"
                    name="vin"
                    placeholder="2022"
                    type="text"
                    statusCompleted={vehicleData.vin ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="Mileage Last Serviced At"
                    name="mileage_last_serviced"
                    placeholder="12000"
                    type="number"
                    statusCompleted={
                        vehicleData.mileage_last_serviced ? true : false
                    }
                    handleChange={handleChange}
                />
                <InputBox
                    label="Date Last Serviced"
                    name="vin"
                    placeholder="2022"
                    type="date"
                    statusCompleted={vehicleData.vin ? true : false}
                    handleChange={handleChange}
                />
                <button onClick={addVehicle}>Add Vehicle</button>
            </div>
        </div>
    );
};

export default AddVehicle;

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
