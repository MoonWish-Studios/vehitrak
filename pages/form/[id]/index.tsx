import React from "react";

import { useRouter, NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Form() {
    const supabaseClient = useSupabaseClient();
    const router: NextRouter = useRouter();
    const [ownerId, setOwnerId] = useState<string | null>(null);

    const [formData, setFormData] = useState(INITIAL_STATE);

    const [licenses, setLicenses] = useState<any>([]);

    const handleChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setFormData({ ...formData, [target.name]: target.value });
    };

    useEffect(() => {
        if (ownerId) {
            getLicenses();
        }
    }, [ownerId]);

    useEffect(() => {
        if (router.isReady) {
            const id = router.query.id as string;
            if (id !== null) setOwnerId(id);
        }
    });

    const getLicenses = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("vehicles")
                .select("*")
                .eq("owner_id", ownerId)
                .select("license");
            console.log(data, error);

            if (data != null) {
                setLicenses(data);
            }
        } catch (error: any) {
            alert("error ");
        }
    };

    const createLog = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("logs")
                .insert(formData);
            if (error) throw error;
            router.push("/");
        } catch (error: any) {
            alert("hi error!");
        }
    };

    return (
        <div className="mx-10 my-10">
            <div>
                {licenses.map(({ license }: { license: string }) => (
                    <div key={license} className="mb-10">
                        <h1>{license}</h1>
                    </div>
                ))}
            </div>
            <form className="form-control">
                <label className="label">
                    <span className="label-text">Vehicle License</span>
                </label>
                <div className="input-group">
                    <select className="select select-bordered">
                        <option disabled selected>
                            Choose License
                        </option>
                        {licenses.map(({ license }: { license: string }) => (
                            <option key={license} className="mb-10">
                                <h1>{license}</h1>
                            </option>
                        ))}
                    </select>
                </div>

                <InputBox
                    label="Inspector"
                    name="inspector"
                    placeholder="John Smith"
                    type="text"
                    handleChange={handleChange}
                />
                <InputBox
                    label="Location"
                    name="location"
                    placeholder="Progress Way, CA "
                    type="text"
                    handleChange={handleChange}
                />
                <InputBox
                    label="Location"
                    name="location"
                    placeholder="Progress Way, CA "
                    type="radio"
                    handleChange={handleChange}
                />
            </form>
            <button className="btn-secondary btn">Button</button>
            <button onClick={() => createLog()}>Insert</button>
        </div>
    );
}

interface InputTypes {
    label: string;
    placeholder?: string;
    className?: string;
    type: string;
    name: string;
    handleChange: (event: React.ChangeEvent) => void;
}

/**
 * @todo add functionality to className
 */

function BooleanBox({
    label,
    placeholder = "",
    className,
    type,
    name,
    handleChange,
}: InputTypes) {}
function InputBox({
    label,
    placeholder = "",
    className,
    type,
    name,
    handleChange,
}: InputTypes) {
    return (
        <div className="form-control w-full max-w-xs ">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                className="input input-bordered w-full max-w-xs"
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={handleChange}
            />
        </div>
    );
}

/**
 * 
 * 
 *     <label className="input-group my-2">
            <span>{label}</span>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className="input input-bordered"
                onChange={handleChange}
            />
        </label>
        
 */
// const { data, error } = await supabase
//   .from('logs')
//   .insert([
//     { some_column: 'someValue', other_column: 'otherValue' },
//   ])

const dataEntry = [
    {
        license: "9DZJ478",
        inspector: "ASLFKAJSFLK",
        location: "ASLFKAJSFLK",
        odometer: "ASLFKAJSFLK",
        head_lights: true,
        tail_lights: true,
        signal_lights: true,
        warning_lights: true,
        wiper_blades: true,
        tire_pressure: [true, true, false, true],
        clean_interior: true,
        clean_exterior: true,
        clean_rear: true,
        description: "The car looking good",
    },
];
const INITIAL_STATE = [
    {
        license: "",
        inspector: "",
        location: "",
        odometer: "",
        head_lights: false,
        tail_lights: false,
        signal_lights: false,
        warning_lights: false,
        wiper_blades: false,
        tire_pressure: [false, false, false, false],
        clean_interior: false,
        clean_exterior: false,
        clean_rear: false,
        description: "",
    },
];
