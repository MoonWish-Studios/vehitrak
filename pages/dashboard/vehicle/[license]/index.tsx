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
    const [logs, setLogs] = useState<FormTypes[] | null>(null);

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
            {logs && <Table logs={logs} />}
            <button onClick={deleteVehicle} className="btn btn-primary">
                Delete Vehicle
            </button>
            <Link href={"/edit-vehicle/" + license} className="btn btn-primary">
                Edit
            </Link>
        </div>
    );
}

function Table({ logs }: { logs: FormTypes[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                {/* head */}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>License</th>
                        <th>Date</th>
                        <th>Inspector</th>
                        <th>Location</th>
                        <th>Odometer</th>
                        <th>Head Lights</th>
                        <th>Tail Lights</th>
                        <th>Signal Lights</th>
                        <th>Warning Lights</th>
                        <th>Wiper Blades</th>
                        <th>Interior</th>
                        <th>Exterior</th>
                        <th>Rear</th>
                        <th>Tire Pressure</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {logs.map((log, index) => (
                        <tr key={log.license} className="hover">
                            {/* #1 Number  */}
                            <th>{index + 1}</th>
                            {/* #2 License */}
                            <td>{log.license}</td>
                            {/* #3 Date */}
                            <td>
                                {new Date(log.time_created!).toDateString()}{" "}
                                {new Date(
                                    log.time_created!
                                ).toLocaleTimeString()}
                            </td>
                            {/* #4 Inspector Name */}
                            <td>{log.inspector}</td>
                            {/* #5 Location */}
                            <td>{log.location}</td>
                            {/* #6 Odometer */}
                            <td>{log.odometer}</td>
                            {/* #7 Head Lights */}
                            <Cell
                                value={
                                    log.head_lights ? "Working" : "Not Working"
                                }
                            />
                            {/* #8 Tail Lights */}
                            <Cell
                                value={
                                    log.tail_lights ? "Working" : "Not Working"
                                }
                            />
                            {/* #9 Signal Lights */}
                            <Cell
                                value={
                                    log.signal_lights
                                        ? "Working"
                                        : "Not Working"
                                }
                            />
                            {/* #10 Warning Lights */}
                            <Cell
                                value={
                                    log.warning_lights
                                        ? "Working"
                                        : "Not Working"
                                }
                            />
                            {/* #11 Wiper Blades */}
                            <Cell
                                value={
                                    log.wiper_blades ? "Working" : "Not Working"
                                }
                            />
                            {/* #12 Clean Interior */}
                            <Cell
                                value={
                                    log.clean_interior ? "Clean" : "Need Clean"
                                }
                            />
                            {/* #13 Clean Exterior */}
                            <Cell
                                value={
                                    log.clean_exterior ? "Clean" : "Need Clean"
                                }
                            />
                            {/* #14 Clean Rear */}
                            <Cell
                                value={log.clean_rear ? "Clean" : "Need Clean"}
                            />{" "}
                            {/* #15 Tire Pressure */}
                            <Cell
                                value={
                                    log.clean_interior ? "Good" : "Need Check"
                                }
                            />
                            {/* #16 Description */}
                            <td>{log.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Cell({ value }: { value: string }) {
    const warnings = ["Need Check", "Need Clean", "Not Working"];
    return (
        <td className={`${warnings.includes(value) && "text-warning"} `}>
            {value}
        </td>
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
