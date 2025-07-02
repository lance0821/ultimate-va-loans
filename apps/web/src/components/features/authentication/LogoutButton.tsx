"use client";

import { Button } from "@repo/ui";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;