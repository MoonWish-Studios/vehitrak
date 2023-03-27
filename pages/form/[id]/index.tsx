import { useRouter, NextRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
import { FormTypes, SelectTypes, InputTypes } from "@/types/types";
import { InputBox, SelectBox } from "@/components/InputTypes";
import MANAGER from "@/hooks/useVehicle";

export default function Form() {
    const supabaseClient = useSupabaseClient();
    const router: NextRouter = useRouter();
    const [ownerId, setOwnerId] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormTypes>(INITIAL_STATE);

    const [licenses, setLicenses] = useState<string[]>([]);

    const handleChange = (
        e:
            | React.FormEvent<HTMLInputElement>
            | React.FormEvent<HTMLSelectElement>
    ) => {
        const target = e.target;

        if (target instanceof HTMLInputElement) {
            setFormData({ ...formData, [target.name]: target.value });
        } else if (target instanceof HTMLSelectElement) {
            if (target.name === "license") {
                return setFormData((prev) => ({
                    ...prev,
                    license: target.value,
                }));
            }
            setFormData((prev) => ({
                ...prev,
                [target.name]:
                    target.value === "Working" || target.value === "Yes",
            }));
        }
    };

    useEffect(() => {
        if (!ownerId) return;
        (async () => {
            const data = await MANAGER.fetchLicensesByUserId(
                supabaseClient,
                ownerId
            );
            setLicenses(data);
        })();
        if (ownerId) {
        }
    }, [ownerId]);

    useEffect(() => {
        if (router.isReady) {
            const id = router.query.id as string;
            if (id !== null) setOwnerId(id);
        }
    });

    const createLog = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data, error } = await supabaseClient
                .from("logs")
                .insert(formData);
            console.log(error);
            if (error) throw error;
            router.push("/");
        } catch (error: any) {
            alert("hi error!");
        }
    };

    return (
        <div className="mx-10 my-10 flex gap-2 justify-center items-center">
            <form onSubmit={createLog} className="form-control">
                <SelectBox
                    placeholder="Choose License"
                    options={licenses}
                    handleChange={handleChange}
                    statusCompleted={formData.license ? true : false}
                    label="Vehicle License"
                    name="license"
                />

                <InputBox
                    label="Inspector"
                    name="inspector"
                    placeholder="John Smith"
                    type="text"
                    handleChange={handleChange}
                    statusCompleted={formData.inspector ? true : false}
                />
                <InputBox
                    label="Location"
                    name="location"
                    placeholder="Progress Way, CA "
                    type="text"
                    statusCompleted={formData.location ? true : false}
                    handleChange={handleChange}
                />
                <InputBox
                    label="Odometer"
                    name="odometer"
                    statusCompleted={formData.odometer ? true : false}
                    placeholder="12000"
                    type="number"
                    handleChange={handleChange}
                />
                <SelectBox
                    placeholder="Check Head Lights"
                    options={["Working", "Not Working"]}
                    handleChange={handleChange}
                    statusCompleted={formData.head_lights !== null}
                    label="Head Lights"
                    name="head_lights"
                />
                <SelectBox
                    placeholder="Check Tail Lights"
                    options={["Working", "Not Working"]}
                    handleChange={handleChange}
                    statusCompleted={formData.tail_lights !== null}
                    label="Tail Lights"
                    name="tail_lights"
                />
                <SelectBox
                    placeholder="Check Signal Lights"
                    options={["Working", "Not Working"]}
                    handleChange={handleChange}
                    statusCompleted={formData.signal_lights !== null}
                    label="Signal Lights"
                    name="signal_lights"
                />

                <SelectBox
                    placeholder="Dashboard Warning Lights On"
                    options={["Yes", "No"]}
                    handleChange={handleChange}
                    statusCompleted={formData.warning_lights !== null}
                    label="Warning Lights"
                    name="warning_lights"
                />
                <SelectBox
                    placeholder="Wiper Blades"
                    options={["Working", "Not Working"]}
                    handleChange={handleChange}
                    statusCompleted={formData.wiper_blades !== null}
                    label="Wiper Blades"
                    name="wiper_blades"
                />
                <SelectBox
                    placeholder="Tires In Good Condition"
                    options={["Yes", "No"]}
                    handleChange={handleChange}
                    statusCompleted={formData.tire_pressure !== null}
                    label="Tire Pressire In Good Condition"
                    name="tire_pressure"
                />

                <SelectBox
                    placeholder="Interior "
                    options={["Yes", "No"]}
                    handleChange={handleChange}
                    statusCompleted={formData.clean_interior !== null}
                    label="Interior is clean"
                    name="clean_interior"
                />
                <SelectBox
                    placeholder="Exterior "
                    options={["Yes", "No"]}
                    handleChange={handleChange}
                    label="Exterior is clean"
                    statusCompleted={formData.clean_exterior !== null}
                    name="clean_exterior"
                />
                <SelectBox
                    placeholder="Check Rear Compartment"
                    options={["Yes", "No"]}
                    statusCompleted={formData.clean_rear !== null}
                    handleChange={handleChange}
                    label="Rear compartment is clean"
                    name="clean_rear"
                />

                <InputBox
                    label="Description"
                    statusCompleted={formData.description ? true : false}
                    className="textarea textarea-bordered"
                    name="description"
                    placeholder="Describe any problems such as warning indicators or accidents"
                    type="text"
                    handleChange={handleChange}
                />
                <button type="submit" className="btn btn-primary mt-4">
                    Insert
                </button>
            </form>
        </div>
    );
}
const INITIAL_STATE = {
    license: "",
    inspector: "",
    location: "",
    odometer: 0,
    head_lights: null,
    tail_lights: null,
    signal_lights: null,
    warning_lights: null,
    wiper_blades: null,
    tire_pressure: null,
    clean_interior: null,
    clean_exterior: null,
    clean_rear: null,
    description: "",
};
