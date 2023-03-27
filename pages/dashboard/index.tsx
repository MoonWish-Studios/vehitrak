import {} from "querystring";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
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

    return (
        <div className="w-full mx-5">
            {/* <div className="pb-10">{user!.id}</div> */}
            <Link href={"/add-vehicle/"} className="btn">
                Add Car
            </Link>

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
        <div className="flex flex-col">
            <div>
                {vehicles.length > 0 &&
                    vehicles.map((vehicle: VehicleDataTypes) => (
                        <div key={vehicle.id} className="mb-10">
                            <pre>{JSON.stringify(userId, null, 2)}</pre>
                            <pre>{JSON.stringify(vehicle, null, 2)}</pre>
                            <Link
                                href={`/dashboard/vehicle/${vehicle.license}`}
                                className="btn btn-secondary"
                            >
                                Open Car
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
}

function CarCard({ make, model, year, license }: VehicleDataTypes) {
    return (
        <div className="card w-96">
            <div className="card-body">
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
