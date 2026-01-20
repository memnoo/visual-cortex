"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { createClient } from "@/lib/database/client";
import { Callout } from "@/app/components/atoms/Callout";
import { useAuth } from "@/app/(app)/hooks/useUser";
import { Loader } from "@/app/components/atoms/Loader";
import { useCheckWaitlist } from "../hooks/useWaitlist";

export default function LoginPage() {
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const { getCurrentUser } = useAuth();
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        router.push("/dashboard");
      }
    };

    checkUser();
  }, []);

  const supabase = createClient();
  const checkWaitlist = useCheckWaitlist();
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const checkResult = await checkWaitlist.mutateAsync(email);
      if (!checkResult) {
        setMessage({
          type: "error",
          text: t("site.login.errors.invalidEmail"),
        });
        return;
      } else if (checkResult.status !== "joined") {
        setMessage({
          type: "error",
          text: t("site.login.errors.waitingList"),
        });
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: t("site.login.success"),
        });
        setEmail("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: t("site.login.errors.generic"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-2">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t("site.login.title")}
        </h2>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleMagicLink} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("site.login.email.label")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("site.login.email.placeholder")}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:bg-indigo-400 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader size="xsmall" fit="content" />
                {t("site.login.sending")}
              </span>
            ) : (
              t("site.login.submit")
            )}
          </button>

          {message && (
            <Callout type={message.type}>
              <p>{message.text}</p>
            </Callout>
          )}
        </form>

        {/* Divider */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              {t("site.login.howItWorks.title")}
            </span>
          </div>
        </div>

        {/* Explication */}
        <div className="mt-6 space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">1.</span>
            <p>{t("site.login.howItWorks.steps.1")}</p>
          </div>
          <div className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">2.</span>
            <p>{t("site.login.howItWorks.steps.2")}</p>
          </div>
          <div className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">3.</span>
            <p>{t("site.login.howItWorks.steps.3")}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600">
        {t("site.login.noAccount.text")}
        <Link className="text-indigo-600 font-semibold" href="/waitlist">
          <p>{t("site.login.noAccount.link")}</p>
        </Link>
      </div>
    </div>
  );
}
