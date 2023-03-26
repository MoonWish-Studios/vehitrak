import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    function signOutUser() {
        supabaseClient.auth.signOut();
        router.push("/");
    }
    return (
        <div>
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <a>Item 1</a>
                        </li>
                        <li tabIndex={0}>
                            <a>
                                Parent
                                <svg
                                    className="fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                                </svg>
                            </a>
                            <ul className="p-2 bg-base-100">
                                <li>
                                    <a>Submenu 1</a>
                                </li>
                                <li>
                                    <a>Submenu 2</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            {!user ? (
                                <Link href={"/login"}>Login</Link>
                            ) : (
                                <button onClick={() => signOutUser()}>
                                    Sign Out
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
