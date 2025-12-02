import { useState } from "react";
import { format } from "date-fns/format";

import { useJoinWaitlist, useCheckWaitlist } from "../../hooks/useWaitlist";

import { isValidEmail } from "@/app/utils/validation/email";
import { WaitlistEntry } from "../../types/types";
import { Callout } from "@/app/components/atoms/Callout";
import { Select } from "@/app/components/atoms/Select";
import { Loader } from "@/app/components/atoms/Loader";
import { useRouter } from "next/navigation";

export const WaitlistForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const [status, setStatus] = useState<"idle" | "checking" | "adding">("idle");

  const [createdInvitation, setCreatedInvitation] = useState<WaitlistEntry>();

  const checkWaitlist = useCheckWaitlist();
  const joinWaitlist = useJoinWaitlist();
  const [result, setResult] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const resetForm = () => {
    setEmail("");
    setInterests([]);

    setCreatedInvitation(undefined);
  };

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
            type: "warning",
            message: `Your access has been granted on the ${format(
              joinedAt,
              "dd/MM/yyyy"
            )}`,
          });
        } else if (status === "pending") {
          setResult({
            type: "warning",
            message: `You joined the waiting list on the ${format(
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
              message: "Waiting list joined!",
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
        message: error.message || "An error occurred.",
      });
    } finally {
      resetForm();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
      <div className="flex flex-col content-stretch gap-3">
        {result && result?.type !== "error" ? (
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
              🎉 You joined the waiting list!
            </h2>

            <div className="flex flex-col content-stretch gap-1 text-gray-600 text-left">
              {result && <Callout type={result.type}>{result.message}</Callout>}

              <p>
                We will send you an email as soon as the access to Memnō will be
                granted.
              </p>
              {createdInvitation && (
                <div className="flex flex-col content-stretch gap-1">
                  {createdInvitation.interest && (
                    <p>
                      We registered your interests for{" "}
                      {createdInvitation.interest}
                    </p>
                  )}
                  <p>
                    You will receive an email at{" "}
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

            <button
              type="button"
              className="cursor-pointer px-8 py-3 text-indigo-600 hover:text-indigo-700 font-semibold rounded-lg hover:bg-gray-50 self-center"
              onClick={() => {
                resetForm();
                setStatus("idle");
                setResult(null);
              }}
            >
              ← Back
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900">
              Enroll right now
            </h2>
            <p className="text-gray-500 italic">
              Be the first to get an access
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status !== "idle"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                />
              </div>

              <Select
                label="What would you like to learn?"
                values={[
                  { value: "Languages", label: "Languages" },
                  { value: "Sciences", label: "Sciences" },
                  { value: "Health", label: "Health" },
                  { value: "History", label: "History" },
                  { value: "Other", label: "Other" },
                ]}
                isMultiple
                isDisabled={status !== "idle"}
                onChange={(newValue) => setInterests(newValue as string[])}
              />

              {result?.type === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{result.message}</p>
                </div>
              )}

              <div className="flex flex-wrap items-stretch gap-2">
                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {status !== "idle" ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader size="xsmall" fit="content" />
                      {status === "checking" && "Checking..."}
                      {status === "adding" && "Enrolling..."}
                    </span>
                  ) : (
                    "Join the waiting list"
                  )}
                </button>
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  I already have an account
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-3">
              By enrolling, you accept to receive updates about the launch
            </p>
          </>
        )}
      </div>
    </div>
  );
};
