"use client";

import { useAuth } from "@/app/(app)/hooks/useUser";
import { Icon } from "@/app/components/atoms/Icon";
import { Loader } from "@/app/components/atoms/Loader";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="flex items-center gap-1">
          <Loader size="xsmall" fit="content" />
          Logging out...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Icon name="logout" />
          <span className="hidden md:inline-block">Log out</span>
        </div>
      )}
    </button>
  );
}
