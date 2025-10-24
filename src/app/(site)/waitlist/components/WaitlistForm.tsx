import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns/format";

import { useJoinWaitlist, useCheckWaitlist } from "../../hooks/useWaitlist";

import { isValidEmail } from "@/app/utils/validation/email";
import { WaitlistEntry } from "../../types/types";

export const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const [status, setStatus] = useState<"idle" | "checking" | "adding">("idle");
  const resetForm = () => {
    setEmail("");
    setInterests([]);
    setCreatedInvitation(undefined);
  };
  const [createdInvitation, setCreatedInvitation] = useState<WaitlistEntry>();

  const checkWaitlist = useCheckWaitlist();
  const joinWaitlist = useJoinWaitlist();
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setCreatedInvitation(undefined);

    if (!isValidEmail(email)) {
      resetForm();
      return;
    }

    try {
      setStatus("checking");
      const checkResult = await checkWaitlist.mutateAsync(email);

      if (checkResult) {
        const { status, createdAt, joinedAt } = checkResult;
        if (joinedAt && status === "joined") {
          setResult({
            type: "success",
            message: `Vous avez déjà accès à Memnō depuis le ${format(
              joinedAt,
              "dd/MM/yyyy"
            )}`,
          });
        } else if (status === "pending") {
          setResult({
            type: "success",
            message: `Vous êtes déjà dans la liste d'attente depuis le ${format(
              createdAt,
              "dd/MM/yyyy"
            )}`,
          });
        }
        setStatus("idle");
        return;
      }

      setStatus("adding");
      joinWaitlist.mutate(
        { email, interest: interests.join(", ") },
        {
          onSuccess: (data) => {
            setResult({
              type: "success",
              message: "Inscription réussie !",
            });
            setCreatedInvitation(data);
          },
          onError: (data) => {
            setResult({
              type: "error",
              message: data.message,
            });
          },
        }
      );
    } catch (error: any) {
      setResult({
        type: "error",
        message: error.message || "Une erreur est survenue.",
      });
    } finally {
      resetForm();
    }
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (interests.includes(selectedValue)) {
      setInterests(interests.filter((v) => v !== e.target.value));
    } else {
      setInterests([...interests, e.target.value]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
      <div className="flex flex-col content-stretch gap-3">
        {result?.type === "success" ? (
          <>
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

            <div className="flex flex-col content-stretch gap-1 text-gray-600 text-left">
              <p>{result.message}</p>

              <p>
                Nous vous enverrons un email dès que vous pourrez accéder à la
                plateforme.
              </p>

              {createdInvitation && (
                <div className="flex flex-col content-stretch gap-1">
                  {createdInvitation.interest && (
                    <p>
                      Nous avons bien noté votre intérêt pour{" "}
                      {createdInvitation.interest}
                    </p>
                  )}
                  <p>
                    Vous recevrez un email à l'adresse{" "}
                    <a
                      href={`mailto:${createdInvitation.email}`}
                      className="text-indigo-600"
                    >
                      {createdInvitation.email}
                    </a>
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/"
              className="inline-block text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer mt-4"
            >
              ← Retour
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900">
              Inscrivez-vous maintenant
            </h2>
            <p className="text-gray-500 italic">Obtenez un accès prioritaire</p>

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
                  disabled={status !== "idle"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qu'aimeriez-vous apprendre ?
                </label>
                <select
                  value={interests}
                  multiple
                  onChange={handleInterestsChange}
                  disabled={status !== "idle"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                >
                  <option defaultValue="">Sélectionner...</option>
                  <option value="Langues">Langues</option>
                  <option value="Sciences">Sciences</option>
                  <option value="Médecine">Médecine</option>
                  <option value="Histoire">Histoire</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {result?.type === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{result.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
              >
                {status !== "idle" ? (
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

                    {status === "checking" && "🔍 Vérification..."}
                    {status === "adding" && "➕ Inscription..."}
                  </span>
                ) : (
                  "🚀 Rejoindre la waiting list"
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-3">
              En vous inscrivant, vous acceptez de recevoir des mises à jour sur
              le lancement
            </p>
          </>
        )}
      </div>
    </div>
  );
};
