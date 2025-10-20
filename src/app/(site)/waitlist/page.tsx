"use client";

import { useState } from "react";
import { createClient } from "@/lib/database/client";
import Footer from "../components/Footer";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data: existing } = await supabase
        .from("waitlist")
        .select("email")
        .eq("email", email)
        .single();

      if (existing) {
        setResult({
          type: "error",
          message: `Vous êtes déjà inscrit !`,
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("waitlist")
        .insert({
          email,
          interest: interest || null,
        })
        .select()
        .single();

      if (error) {
        setResult({
          type: "error",
          message: "Une erreur est survenue. Réessayez.",
        });
      } else {
        setResult({
          type: "success",
          message: "Inscription réussie !",
        });

        setEmail("");
        setInterest("");
      }
    } catch (error) {
      setResult({
        type: "error",
        message: "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  return !result || result.type === "error" ? (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left side - Info */}
      <div className="space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Rejoignez la
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            révolution
          </span>
          <br />
          de l'apprentissage
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed">
          Soyez parmi les premiers à découvrir FlashCards AI : la plateforme
          d'apprentissage intelligent qui s'adapte à votre rythme.
        </p>

        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">IA Personnalisée</h3>
              <p className="text-gray-600 text-sm">
                Génération automatique de flashcards adaptées
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Multi-domaines</h3>
              <p className="text-gray-600 text-sm">
                Langues, sciences, médecine et plus
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Algorithme intelligent
              </h3>
              <p className="text-gray-600 text-sm">
                Espacement répété optimisé par l'IA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Inscrivez-vous maintenant
        </h2>
        <p className="text-gray-600 mb-6">
          Obtenez un accès prioritaire et des avantages exclusifs
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qu'aimeriez-vous apprendre ?
            </label>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
            >
              <option value="">Sélectionner...</option>
              <option value="language">Langues</option>
              <option value="science">Sciences</option>
              <option value="medicine">Médecine</option>
              <option value="history">Histoire</option>
              <option value="other">Autre</option>
            </select>
          </div>

          {result?.type === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{result.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                Inscription...
              </span>
            ) : (
              "🚀 Rejoindre la waiting list"
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          En vous inscrivant, vous acceptez de recevoir des mises à jour sur le
          lancement
        </p>
      </div>
    </div>
  ) : (
    /* Success State */
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-2xl p-12 border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Vous êtes inscrit !
        </h2>

        <p className="text-gray-600 mb-6">
          Nous vous enverrons un email dès que vous pourrez accéder à la
          plateforme.
        </p>

        <button
          onClick={() => setResult(null)}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
}
