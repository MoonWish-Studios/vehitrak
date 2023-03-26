export interface FormTypes {
    license: string;
    inspector: string;
    location: string;
    odometer: number;
    head_lights: boolean | null;
    tail_lights: boolean | null;
    signal_lights: boolean | null;
    warning_lights: boolean | null;
    wiper_blades: boolean | null;
    tire_pressure: boolean | null;
    clean_interior: boolean | null;
    clean_exterior: boolean | null;
    clean_rear: boolean | null;
    description: string;
}

export interface InputTypes {
    label: string;
    placeholder?: string;
    className?: string;
    type: string;
    name: string;
    statusCompleted: boolean;
    handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

export interface SelectTypes {
    label: string;
    className?: string;
    placeholder: string;
    name: string;
    statusCompleted: boolean;
    options: string[];
    handleChange: (event: React.FormEvent<HTMLSelectElement>) => void;
}

export interface UserDataTypes {
    id: string;
    first_name: string;
    last_name: string;
    business_name: string;
}
export interface VehicleDataTypes {
    owner_id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
}
