"use client";
import type { AppProps } from "next/app";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import "../styles/globals.css";
// Providers (providing supabase, next ui)

export default function App({ Component, pageProps }: AppProps) {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient());

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            <Navbar />
            <Component {...pageProps} />
        </SessionContextProvider>
    );
}
