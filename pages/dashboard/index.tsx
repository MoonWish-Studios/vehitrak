import {} from "querystring";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import {
    createServerSupabaseClient,
    User,
} from "@supabase/auth-helpers-nextjs";
import MANAGER from "@/hooks/useVehicle";
// import VehicleCard from "@/components/VehicleCard";
import { VehicleDataTypes } from "@/types/types";
const numberReg = /^\d+$/;
export default function Users() {
    const supabaseClient = useSupabaseClient();
    const user = useUser();

    const shareData = {
        title: "MDN",
        text: "Learn web development on MDN!",
        url: "https://developer.mozilla.org",
    };
    return (
        <div className="w-full px-3 flex flex-col items-center justify-center ">
            {/* <div className="pb-10">{user!.id}</div> */}
            <div className="flex flex-row">
                <Link href={"/add-vehicle/"} className=" btn btn-ghost">
                    Add Car
                </Link>
                {user?.id !== undefined && (
                    <Link
                        target="_blank"
                        href={"/form/" + user?.id}
                        className="btn btn-ghost"
                    >
                        Open Form
                    </Link>
                )}
            </div>

            {user?.id !== undefined && supabaseClient && (
                <VehicleCard
                    supabaseClient={supabaseClient}
                    userId={user?.id}
                ></VehicleCard>
            )}
        </div>
    );
}

export function VehicleCard({
    supabaseClient,
    userId,
}: {
    supabaseClient: any;
    userId: string;
}) {
    const [vehicles, setVehicles] = useState<VehicleDataTypes[] | []>([]);

    useEffect(() => {
        (async () => {
            const data = await MANAGER.fetchVehicleByUserId(
                supabaseClient,
                userId
            );
            setVehicles(data);
        })();
    }, []);
    return (
        <div className="flex flex-col w-fit justify-center items-center mx-auto">
            <div className="flex flex-wrap justify-center  gap-5 ">
                {vehicles.length > 0 &&
                    vehicles.map((vehicle: VehicleDataTypes) => (
                        <Link href={"/dashboard/vehicle/" + vehicle.license}>
                            <div
                                // href={"/dashboard/vehicle/" + vehicle.license}
                                className="max-w-sm rounded overflow-hidden shadow-lg "
                            >
                                <Image
                                    className="w-full p-7"
                                    src={"/mercedes.webp"}
                                    width={900}
                                    height={900}
                                    alt="Sunset in the mountains"
                                />
                                <div className="px-6 py-4">
                                    <div className="flex flex-row gap-2 justify-start items-center">
                                        <div className="font-bold text-xl">
                                            {vehicle.year} {vehicle.make}{" "}
                                            {vehicle.model}
                                        </div>
                                        {vehicle.has_issue ? (
                                            <Image
                                                src={"/red-circle.svg"}
                                                alt={"Red"}
                                                className="animate-bounce"
                                                height={12}
                                                width={12}
                                            />
                                        ) : (
                                            <Image
                                                src={"/green-circle.svg"}
                                                alt={"green"}
                                                className="animate"
                                                height={12}
                                                width={12}
                                            />
                                        )}
                                    </div>
                                    <p>{vehicle.license}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
}

function CarCard({ make, model, year, license }: VehicleDataTypes) {
    return (
        <div className="card w-96">
            <div className="card-body ">
                <h2 className="card-title">Life hack</h2>
                <p>How to park your car at your garage?</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Learn now!</button>
                </div>
            </div>
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
