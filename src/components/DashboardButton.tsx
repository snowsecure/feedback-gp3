"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardButton() {
    const pathname = usePathname();

    if (pathname === '/login') {
        return null;
    }

    return (
        <Link href="/dashboard" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            Admin Dashboard
        </Link>
    );
}
