"use client";

import { LoginDialog } from "./LoginModal";
import { useState } from "react";

// Wrapper to use LoginDialog imperatively or via state if needed, 
// ensuring it mounts correctly on client.
export default function AuthDialogs({
    isLoginOpen,
    setIsLoginOpen
}: {
    isLoginOpen: boolean,
    setIsLoginOpen: (open: boolean) => void
}) {
    return (
        <LoginDialog
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
        />
    )
}
