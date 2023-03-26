import VehicleCard from "../../../components/VehicleCard";
import {} from "querystring";
import { useRouter, NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { UUID } from "crypto";
import Link from "next/link";

const numberReg = /^\d+$/;
export default function Users() {
    const router: NextRouter = useRouter();
    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.id as string;
            if (id !== null) setId(id);
        }
    });

    return (
        <div className="w-full mx-5">
            {id && (
                <>
                    <div className="pb-10">{id}</div>
                    <Link href={"/add-vehicle/" + id} className="btn">
                        Add Car
                    </Link>
                    <VehicleCard userid={id}></VehicleCard>
                </>
            )}
        </div>
    );
}
