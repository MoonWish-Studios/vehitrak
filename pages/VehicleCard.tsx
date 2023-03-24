import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
export default function VehicleCard() {
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
                .eq("owner", 2)
                .limit(10);
            console.log(data);
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
                    <div>
                        <h1>
                            Make: {vehicle.make} {vehicle.model} {vehicle.year}
                        </h1>
                        <p>License Plate: {vehicle.license}</p>
                        <p>Vin Number: {vehicle.vin}</p>
                        <p>Owner ID: {vehicle.owner}</p>
                        <p>Error Codes: {vehicle.error_codes}</p>
                        <p>Last Updated: {vehicle.last_updated}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
