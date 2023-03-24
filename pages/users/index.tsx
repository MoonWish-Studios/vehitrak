import VehicleCard from "../VehicleCard";
import { useRouter } from "next/router";

export default function Users() {
    // const router = useRouter();
    // const { id } = router.query;

    return (
        <div>
            <div className="pb-10">2: Beach Plumbing</div>
            <VehicleCard></VehicleCard>
        </div>
    );
}
