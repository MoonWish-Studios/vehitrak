import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    let [open, setOpen] = useState(false);

    function signOutUser() {
        supabaseClient.auth.signOut();
        router.push("/");
    }
    return (
        <div className="sticky top-5 z-[999] flex items-center justify-center  w-full">
            <div
                className="bg-zinc-200 bg-opacity-30 backdrop-filter backdrop-blur-md mb-10 
            flex flex-row items-center justify-between px-8 mx-48 py-3 rounded-lg gap-[1.1rem] md:gap-[18rem] lg:gap-[32rem] "
            >
                <div className="text-2xl">Vehitrack</div>
                <div className="flex items-center justify-center">
                    <div
                        onClick={() => setOpen(!open)}
                        className="dropdown rounded-full "
                    >
                        <label tabIndex={0} className="hover:cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </label>
                        {open ? (
                            <ul
                                tabIndex={0}
                                className="backdrop-filter backdrop-blur-lg menu menu-compact 
                            dropdown-content mt-3 p-2 -translate-x-32 translate-y-3 shadow bg-zinc-100 rounded-box w-48"
                            >
                                <li>
                                    <Link
                                        href={"/dashboard"}
                                        className="text-lg"
                                    >
                                        Dashboard
                                    </Link>
                                </li>

                                <li>
                                    {!user ? (
                                        <Link
                                            className="text-lg"
                                            href={"/login"}
                                        >
                                            Login
                                        </Link>
                                    ) : (
                                        <button
                                            className="text-lg"
                                            onClick={() => signOutUser()}
                                        >
                                            Sign Out
                                        </button>
                                    )}
                                </li>
                            </ul>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

{
    /* <div className="flex-none">
    <ul className="btn-ghost p-3 rounded-sm flex items-center justify-center">
        <li>
            {!user ? (
                <Link href={"/login"}>Login</Link>
            ) : (
                <button onClick={() => signOutUser()}>Sign Out</button>
            )}
        </li>
    </ul>
</div>; */
}
