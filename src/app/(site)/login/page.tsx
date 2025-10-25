"use client";

import { useState } from "react";
import { createClient } from "@/lib/database/client";
import { Callout } from "@/app/components/atoms/Callout";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dashboard");
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
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
          text: "✉️ Magic link envoyé ! Vérifiez votre boîte email.",
        });
        setEmail("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Une erreur est survenue. Réessayez.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-2">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Connexion</h2>
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
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
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
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Envoi en cours...
              </span>
            ) : (
              "✨ Envoyer le magic link"
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
              Comment ça marche ?
            </span>
          </div>
        </div>

        {/* Explication */}
        <div className="mt-6 space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">1.</span>
            <p>Entrez votre adresse email ci-dessus</p>
          </div>
          <div className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">2.</span>
            <p>Recevez un lien de connexion sécurisé par email</p>
          </div>
          <div className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">3.</span>
            <p>Cliquez sur le lien pour vous connecter automatiquement</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Pas encore de compte ?{" "}
          <span className="text-indigo-600 font-semibold">
            Il sera créé automatiquement ! 🎉
          </span>
        </p>
      </div>
    </div>
  );
}
