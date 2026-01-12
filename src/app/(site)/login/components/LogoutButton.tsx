"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuth } from "@/app/(app)/hooks/useUser";
import { Icon } from "@/app/components/atoms/Icon";
import { Loader } from "@/app/components/atoms/Loader";

export default function LogoutButton() {
  const t = useTranslations();
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
          {t("auth.loggingOut")}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Icon name="logout" />
          <span className="hidden md:inline-block">{t("auth.logout")}</span>
        </div>
      )}
    </button>
  );
}
