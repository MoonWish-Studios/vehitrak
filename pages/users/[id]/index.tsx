import VehicleCard from "../../VehicleCard";
import {} from "querystring";
import { useRouter, NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { UUID } from "crypto";

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
        <div>
            {id && (
                <>
                    <div className="pb-10">{id}</div>
                    <VehicleCard userid={id}></VehicleCard>
                </>
            )}
        </div>
    );
}
