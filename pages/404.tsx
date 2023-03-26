import React from "react";

import Link from "next/link";
export default function Error404() {
    return (
        <div className="flex">
            We were unable to find the change you were looking for
            <Link className="btn btn-primary" href="/login">
                Go Home
            </Link>
        </div>
    );
}
