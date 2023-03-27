import React, { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FormTypes, VehicleDataTypes } from "@/types/types";
import { GetServerSidePropsContext } from "next";
import { format, formatRelative, differenceInDays, addMonths } from "date-fns";
import Image from "next/image";
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
                .eq("license", license)
                .order("time_created", { ascending: false });
            // Set State for logs

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
                .eq("license", license)
                .single();

            if (error) {
                throw Error("This vehicle does not exist anymore");
            }

            if (data != null) {
                setVehicleData(data as any);
            }
        } catch (error: any) {
            alert(error.message);
            router.push("/dashboard");
        }
    };

    const deleteLog = async (id: number, license: string) => {
        try {
            const { error } = await supabaseClient
                .from("logs")
                .delete()
                .eq("id", id);
            if (!error) {
                alert("Successfully Deleted Log");
                fetchLogs(license);
            }
        } catch (error: any) {
            alert(error);
        }
    };

    const deleteVehicle = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("vehicles")
                .delete()
                .eq("license", license);
            if (!error) {
                router.push("/dashboard");
            }
        } catch (error: any) {
            alert(error);
        }
    };

    // the saveCHanges function in editVehicle
    const updateVehicle = async (has_issue: boolean) => {
        try {
            const { error } = await supabaseClient
                .from("vehicles")
                .update({ ...vehicleData, has_issue })
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
        <div>
            <div className=" w-full mb-56 mt-10">
                <div className="topSection w-full flex flex-col items-center">
                    <Image
                        src={"/mercedes.webp"}
                        alt={"mercedes"}
                        height={375}
                        width={375}
                    />
                    <h1 className="text-2xl font-semibold mt-7">
                        {vehicleData?.year} {vehicleData?.make}{" "}
                        {vehicleData?.model}
                    </h1>
                    <div className="flex flex-row items-center justify-center gap-2 mb-8 mt-1">
                        <p className="text-gray-500 text-lg tracking-wide  ">
                            #{vehicleData?.license}
                        </p>
                        <Link href={`/edit-vehicle/` + vehicleData?.license}>
                            <Image
                                className=""
                                src={"/pencil.svg"}
                                alt={"edit icon"}
                                height={30}
                                width={30}
                            />
                        </Link>
                    </div>
                </div>
                <div className=" flex flex-row item-center">
                    {logs && vehicleData && (
                        <LatestLogSection
                            updateVehicle={updateVehicle}
                            logs={logs}
                            vehicleData={vehicleData}
                        />
                    )}
                </div>
            </div>

            {/* One Log */}

            {/*  Logs */}
            {logs && logs.length > 0 && (
                <>
                    <h1 className="text-lg font-bold ml-4 my-2">
                        {vehicleData?.year} {vehicleData?.make}{" "}
                        {vehicleData?.model} Log Entries
                    </h1>
                    <Table logs={logs} deleteLog={deleteLog} />
                </>
            )}

            <div className="w-full flex flex-col items-center justify-center mt-5">
                <p className="text-zinc-500 tracking-wider text-base mb-2">
                    VIN #{vehicleData?.vin}
                </p>
                <Modal label="Delete Vehicle" deleteVehicle={deleteVehicle}>
                    Are you sure you want to delete your vehicle? You cannot
                    undo this action.
                </Modal>
            </div>
        </div>
    );
}

function Alert({ children }: { children: string }) {
    return (
        <div className="alert alert-info shadow-lg  px-10 w-fit mx-auto bg-accent">
            <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current flex-shrink-0 w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
                <span>{children}</span>
            </div>
        </div>
    );
}
function LatestLogSection({
    logs,
    vehicleData,
    updateVehicle,
}: {
    logs: FormTypes[];
    vehicleData: VehicleDataTypes;
    updateVehicle: (has_issue: boolean) => void;
}) {
    if (logs.length === 0) {
        return <Alert>There are no logs available</Alert>;
    }
    const date = new Date(logs[0].time_created!);
    const current_odometer = logs[0].odometer;
    const prev_odometer = logs[1] ? logs[1].odometer : 0;
    const inspector = logs[0].inspector;
    const location = logs[0].location;
    const miles_threshold = 7000;
    const month_threshold = 5;

    const last_serviced_mileage = vehicleData.mileage_last_serviced;
    const last_serviced_date = new Date(vehicleData.date_last_serviced);
    const days_until_service = addMonths(last_serviced_date, month_threshold);
    const miles_since_serviced = current_odometer - last_serviced_mileage;
    const miles_left = miles_threshold - miles_since_serviced;

    // const days_since_serviced = differenceInDays(
    //     new Date(),
    //     last_serviced_date
    // );
    const days_left = differenceInDays(days_until_service, date);
    const needs_service_by_miles = miles_left <= 50 ? true : false;
    const needs_service_by_date = days_left <= 7 ? true : false;
    // if (needs_service_by_miles) {
    //     alert("get service");
    // }
    useEffect(() => {
        if (needs_service_by_date || needs_service_by_miles) {
            updateVehicle(true);
        } else {
            // if the current database says true but now it doesn't have problems, set false
            if (vehicleData.has_issue === true) {
                updateVehicle(false);
            }
        }
    }, [logs]);

    return (
        <div className="flex flex-col justify-center items-center  gap-2 px-8">
            <div className="flex gap-2 justify-center w-full box-border flex-wrap ">
                {/* Miles since last inspection */}
                <Stat
                    label="Miles Until Service"
                    titleClass={`${
                        needs_service_by_miles ? "text-red-500" : ""
                    }`}
                    value={`${miles_left} miles`}
                >
                    Every 7000 Miles
                </Stat>
                {/* Days since last inspection */}
                <Stat
                    label="Days Until Service"
                    titleClass={`${
                        needs_service_by_date ? "text-red-500" : ""
                    }`}
                    value={`${days_left} days`}
                >
                    Every 5 Months
                </Stat>
                {/* Mileage */}
                <Stat label="Latest Mileage" value={current_odometer}>
                    {current_odometer - prev_odometer} miles more
                </Stat>
                {/* Inspector */}
                <Stat label="Inspector" value={inspector}></Stat>
                {/*  Location */}
                <Stat label="Location" value={location}></Stat>

                {/* Date */}
                <Stat label="Date" value={format(date, "P")}>
                    {formatRelative(date, new Date())}
                </Stat>

                {/* Head Lights */}
                <Stat
                    label="Head Lights"
                    titleClass={
                        logs[0].head_lights ? "text-green-500" : "text-red-500"
                    }
                    value={logs[0].head_lights ? "Working" : "Not Working"}
                ></Stat>
                {/* Tail Lights */}
                <Stat
                    label="Tail Lights"
                    titleClass={
                        logs[0].tail_lights ? "text-green-500" : "text-red-500"
                    }
                    value={logs[0].tail_lights ? "Working" : "Not Working"}
                ></Stat>
                {/* Signal Lights */}
                <Stat
                    label="Signal Lights"
                    titleClass={
                        logs[0].signal_lights
                            ? "text-green-500"
                            : "text-red-500"
                    }
                    value={logs[0].signal_lights ? "Working" : "Not Working"}
                ></Stat>
                {/* Wiper Blades */}
                <Stat
                    label="Wiper Blades"
                    titleClass={
                        logs[0].wiper_blades ? "text-green-500" : "text-red-500"
                    }
                    value={logs[0].wiper_blades ? "Working" : "Not Working"}
                ></Stat>
                {/* Tire Pressure */}
                <Stat
                    label="Tire Pressure"
                    titleClass={
                        logs[0].tire_pressure
                            ? "text-green-500"
                            : "text-red-500"
                    }
                    value={logs[0].wiper_blades ? "Good" : "Needs Check"}
                ></Stat>
                {/* Wiper Blades */}
                <Stat
                    label="Wiper Blades"
                    titleClass={
                        logs[0].wiper_blades ? "text-green-500" : "text-red-500"
                    }
                    value={logs[0].wiper_blades ? "Working" : "Not Working"}
                ></Stat>
                {/* Warning Lights */}
                <Stat
                    label="Warning Lights"
                    titleClass={
                        logs[0].warning_lights
                            ? "text-green-500"
                            : "text-red-500"
                    }
                    value={logs[0].warning_lights ? "None" : "Check"}
                ></Stat>
                {/* Interior */}
                <Stat
                    label="Interior"
                    titleClass={
                        logs[0].clean_interior
                            ? "text-green-500"
                            : "text-red-500"
                    }
                    value={logs[0].clean_interior ? "Clean" : "Needs Clean"}
                ></Stat>
                {/* Exterior */}
                <Stat
                    label="Exterior"
                    titleClass={
                        logs[0].clean_exterior
                            ? "text-green-500"
                            : "text-red-500"
                    }
                    value={logs[0].clean_exterior ? "Clean" : "Needs Clean"}
                ></Stat>
                {/* Rear */}
                <Stat
                    label="Rear"
                    titleClass={
                        logs[0].clean_rear ? "text-green-500" : "text-red-500"
                    }
                    value={logs[0].clean_rear ? "Clean" : "Needs Clean"}
                ></Stat>
            </div>
            <div className="shadow-sm border border-neutral-200 inline-grid w-fit max-w-3xl grid-cols-1 rounded-md p-6 bg-white">
                <div className="stat-title">Description</div>
                <p className="font-semibold text-neutral-700 flex-wrap">
                    {logs[0].description}
                </p>
            </div>
        </div>
    );
}
function Stat({
    label,
    value,
    children,
    titleClass,
    containerClass,
}: {
    label: string;
    value: React.ReactNode;
    children?: React.ReactNode;
    titleClass?: string;
    containerClass?: string;
}) {
    return (
        <div
            className={`stats  shadow-sm ${containerClass} border border-neutral-200`}
        >
            <div className="stat">
                <div className={`$ stat-title`}>{label}</div>
                <div
                    className={`stat-value text-[1.3rem] md:text-[1.8rem] ${titleClass} `}
                >
                    {value}
                </div>
                <div className="stat-desc">
                    {!children ? <>&nbsp;</> : children}
                </div>
            </div>
        </div>
    );
}
function Table({
    logs,
    deleteLog,
}: {
    logs: FormTypes[];
    deleteLog: (id: number, license: string) => Promise<void>;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                {/* head */}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Inspector</th>
                        <th>Date</th>
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {logs.map((log, index) => (
                        <tr
                            key={log.time_created?.toString()}
                            className="hover"
                        >
                            {/* #1 Number  */}
                            <th>{logs.length - index}</th>
                            {/* #2 inspector */}
                            <td>{log.inspector}</td>
                            {/* #3 Date */}
                            <td>
                                {new Date(log.time_created!).toDateString()}{" "}
                                {new Date(
                                    log.time_created!
                                ).toLocaleTimeString()}
                            </td>
                            {/* #4 Location */}
                            <td>{log.location}</td>
                            {/* #5 Odometer */}
                            <td>{log.odometer}</td>
                            {/* #6 Head Lights */}
                            <Cell
                                value={
                                    log.head_lights ? "Working" : "Not Working"
                                }
                            />
                            {/* #7 Tail Lights */}
                            <Cell
                                value={
                                    log.tail_lights ? "Working" : "Not Working"
                                }
                            />
                            {/* #8 Signal Lights */}
                            <Cell
                                value={
                                    log.signal_lights
                                        ? "Working"
                                        : "Not Working"
                                }
                            />
                            {/* #9 Warning Lights */}
                            <Cell
                                value={log.warning_lights ? "None" : "Check"}
                            />
                            {/* #10 Wiper Blades */}
                            <Cell
                                value={
                                    log.wiper_blades ? "Working" : "Not Working"
                                }
                            />
                            {/* #11 Clean Interior */}
                            <Cell
                                value={
                                    log.clean_interior ? "Clean" : "Needs Clean"
                                }
                            />
                            {/* #12 Clean Exterior */}
                            <Cell
                                value={
                                    log.clean_exterior ? "Clean" : "Needs Clean"
                                }
                            />
                            {/* #13 Clean Rear */}
                            <Cell
                                value={log.clean_rear ? "Clean" : "Needs Clean"}
                            />
                            {/* #14 Tire Pressure */}
                            <Cell
                                value={
                                    log.clean_interior ? "Good" : "Needs Check"
                                }
                            />
                            {/* #15 Description */}
                            <td className="">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Voluptatem nostrum alias nam
                                unde laudantium earum! Ut quo suscipit,
                                laudantium molestias neque, hic dolore incidunt
                                necess{log.description}
                            </td>
                            {/* #16 Button Actions */}
                            <td className="btn-group">
                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        deleteLog(
                                            parseInt(log.id!),
                                            log.license
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Cell({ value }: { value: string }) {
    const warnings = ["Need Check", "Needs Clean", "Not Working"];
    return (
        <td className={`${warnings.includes(value) && "text-warning"} `}>
            {value}
        </td>
    );
}

function Modal({
    label,
    children,
    deleteVehicle,
}: {
    label: string;
    children: string;
    deleteVehicle: () => Promise<void>;
}) {
    return (
        <>
            {/* The button to open modal */}
            <label htmlFor="my-modal-4" className="btn btn-warning">
                {label}
            </label>

            <input type="checkbox" id="my-modal-4" className="modal-toggle" />
            <label
                htmlFor="my-modal-4"
                className="modal modal-bottom sm:modal-middle cursor-pointer"
            >
                <label className="modal-box relative" htmlFor="">
                    <h3 className="text-lg font-bold">{label}</h3>
                    <p className="py-4">{children}</p>
                    <div className="modal-action">
                        <label
                            onClick={deleteVehicle}
                            htmlFor="my-modal-4"
                            className="btn btn-warning"
                        >
                            Delete Vehicle
                        </label>
                    </div>
                </label>
            </label>
            {/* Put this part before </body> tag */}
            {/* <input type="checkbox" id="my-modal-6" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{label}?</h3>
                    <p className="py-4">{children}</p>
                    <div className="modal-action">
                        <label
                            onClick={deleteVehicle}
                            htmlFor="my-modal-6"
                            className="btn btn-warning"
                        >
                            Delete Vehicle
                        </label>
                    </div>
                </div>
            </div> */}
        </>
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
