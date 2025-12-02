"use client";

import { redirect } from "next/navigation";

import { useAuth } from "./hooks/useUser";
import { Providers } from "../providers";
import LogoutButton from "@/app/(site)/login/components/LogoutButton";

import "../styles/globals.css";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { BrandName } from "../components/BrandName";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User>();
  const { getCurrentUser } = useAuth();
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();

      if (!user) {
        redirect("/login");
      } else {
        setUser(user);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Providers>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <BrandName />
                <p className="text-sm text-gray-600">
                  Welcome, {user?.email ?? "..."}
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="max-w-8xl mx-auto p-4">{children}</main>
      </Providers>
    </div>
  );
}
