import React, { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FormTypes, VehicleDataTypes } from "@/types/types";
import { GetServerSidePropsContext } from "next";
import {
    createServerSupabaseClient,
    User,
} from "@supabase/auth-helpers-nextjs";
import { supabase } from "@supabase/auth-ui-shared";
import Link from "next/link";
/**
 *
 * @todo Save vehicle detail
 * @todo Fetch and display vehicle logs
 *
 */
export default function VehicleDetails() {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [license, setLicense] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [vehicleData, setVehicleData] = useState<VehicleDataTypes>();
    const [logs, setLogs] = useState<FormTypes | null>(null);

    useEffect(() => {
        // get vehicle logs
        if (!license) return;

        fetchLogs(license);
        getVehicleData(license);
    }, [license]);

    useEffect(() => {
        if (router.isReady) {
            const license = router.query.license as string;
            const user = router.query.id as string;
            if (license !== null && user !== null) {
                setLicense(license);
                setId(id);
            }
        }
    }, [router]);

    const fetchLogs = async (license: string) => {
        console.log("FETCHING LOGS");
        try {
            const { data, error } = await supabaseClient
                .from("logs")
                .select("*")
                .eq("license", license);
            // Set State for logs
            console.log(data);
            setLogs(data as any as null);
        } catch (err) {
            console.log("fetching logs error");
            console.error(err);
        }
    };

    const getVehicleData = async (license: string) => {
        try {
            const { data, error } = await supabaseClient
                .from("vehicles")
                .select("*")
                .eq("license", license);
            console.log(data, error);

            if (error) {
                throw Error("THERE WAS AN ERROR WITH FECHING THE CAR");
                console.log("WE have an error with data fetching");
                // console.log(router.back());
            }

            if (data != null) {
                setVehicleData(data as any);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const deleteVehicle = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("vehicles")
                .delete()
                .eq("license", license);
            if (!error) {
                router.back();
            }
        } catch (error: any) {
            alert(error);
        }
    };

    return (
        <div>
            <pre>{JSON.stringify(logs, null, 2)}</pre>
            <button onClick={deleteVehicle} className="btn btn-primary">
                Delete Vehicle
            </button>
            <Link href={"/edit-vehicle/" + license} className="btn btn-primary">
                Edit
            </Link>
        </div>
    );
}

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
