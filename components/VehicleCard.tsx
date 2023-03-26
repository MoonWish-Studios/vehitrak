import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import Link from "next/link";
import { useState, useEffect } from "react";
export default function VehicleCard({ userid }: { userid: string }) {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [vehicles, setVehicles] = useState<any>([]);

    useEffect(() => {
        getVehicleData();
    }, []);

    const getVehicleData = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("vehicles")
                .select("*")
                .eq("owner_id", userid)
                .limit(10);
            console.log(data, error);

            if (data != null) {
                setVehicles(data);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };
    return (
        <div className="flex flex-col">
            <div>
                {vehicles.map((vehicle: any) => (
                    <div key={vehicle.id} className="mb-10">
                        <pre>{JSON.stringify(user, null, 2)}</pre>
                        {/* <h1>
                            Make: {vehicle.make} {vehicle.model} {vehicle.year}
                        </h1> */}
                        <pre>{JSON.stringify(vehicle, null, 2)}</pre>
                        {/* <p>License Plate: {vehicle.license}</p>
                        <p>Vin Number: {vehicle.vin}</p>
                        <p>Owner ID: {vehicle.owner}</p>
                        <p>Error Codes: {vehicle.error_codes}</p>
                        <p>Last Updated: {vehicle.last_updated}</p> */}
                        <Link
                            href={`/dashboard/${vehicle.owner_id}/vehicle/${vehicle.license}`}
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
