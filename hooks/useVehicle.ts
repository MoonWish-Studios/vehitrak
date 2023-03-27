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

export function ActionManager() {
    const fetchLogs = async (supabaseClient: any, license: string) => {
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

    const fetchLicensesByUserId = async (
        supabaseClient: any,
        userId: string
    ) => {
        try {
            const { data, error } = await supabaseClient
                .from("vehicles")
                .select("*")
                .eq("owner_id", userId)
                .select("license");

            if (data != null) {
                const licenses = data.map(
                    ({ license }: { license: string }) => license
                );
                return licenses;
            }
        } catch (err) {
            console.error(err);
        }
    };
    const fetchVehicleByUserId = async (
        supabaseClient: any,
        userId: string
    ) => {
        try {
            const { data, error } = await supabaseClient
                .from("vehicles")
                .select("*")
                .eq("owner_id", userId)
                .limit(10);
            return data;
        } catch (error: any) {
            alert(error.message);
        }
    };

    const fetchUser = async (supabaseClient: any, userId: string) => {
        try {
            const { data, error } = await supabaseClient
                .from("users")
                .select("*")
                .eq("id", userId);

            return data;
        } catch (error: any) {
            alert(error.message);
        }
    };
    const fetchVehicleByLicense = async (
        supabaseClient: any,
        license: string
    ) => {
        try {
            const { data, error } = await supabaseClient
                .from("vehicles")
                .select("*")
                .filter("license", "eq", license)
                .single();
            return data;
        } catch (err) {
            alert("There was an error fetching vehicle by license");
        }
    };

    return {
        fetchLogs,
        fetchVehicleByUserId,
        fetchVehicleByLicense,
        fetchLicensesByUserId,
        fetchUser,
    };
}
const MANAGER = ActionManager();
export default MANAGER;
