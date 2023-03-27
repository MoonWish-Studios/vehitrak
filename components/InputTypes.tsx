import { InputTypes, SelectTypes } from "@/types/types";

export function InputBox({
    label,
    placeholder = "",
    className,
    type,
    name,
    initialValue,
    handleChange,
    statusCompleted,
}: InputTypes) {
    return (
        <div className="form-control w-full ">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                className={`
                input min-w-[18rem]
                ${statusCompleted ? "input-success" : "input-warning"}  `}
                type={type}
                name={name}
                placeholder={placeholder}
                value={initialValue}
                onChange={handleChange}
                required={true}
            />
        </div>
    );
}

export function SelectBox({
    label,
    name,
    placeholder,
    handleChange,
    options,
    statusCompleted,
}: SelectTypes) {
    return (
        <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <select
                name={name}
                defaultValue=""
                required
                onInput={handleChange}
                className={`select ${
                    statusCompleted ? "select-success" : "select-warning"
                }`}
            >
                <option disabled value="">
                    Choose One
                </option>

                {options.map((op, index) => (
                    <option key={index} value={op}>
                        {op}
                    </option>
                ))}
            </select>
        </div>
    );
}
