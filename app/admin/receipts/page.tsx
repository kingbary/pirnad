"use client";

import dynamic from "next/dynamic"

const ReceiptScreen = dynamic(
    () => import("@/components/receipt-screen"),
    { ssr: false }
)

export default function Page() {
    return <ReceiptScreen />
}