import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import LogoutButton from '@/components/features/authentication/LogoutButton';

const DashboardPage = async () => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // This is a failsafe, as the layout should have already caught this.
        return redirect("/login");
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <LogoutButton />
            </div>
            <p className="mt-4">
                Welcome, <span className="font-mono text-primary">{user.email}</span>!
            </p>
            <p className="mt-2 text-muted-foreground">
                This is your protected dashboard. Only logged-in users can see this.
            </p>
        </div>
    );
};

export default DashboardPage;