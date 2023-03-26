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

export default function useVehicle() {
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
        if (!id) return;
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
        try {
            const { data, error } = await supabaseClient
                .from("logs")
                .select("*")
                .eq("license", license);
            return data;
        } catch (err) {
            console.error(err);
        }
    };
    return { fetchLogs, logs };
}
