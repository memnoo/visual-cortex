"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/database/client";
import Button from "@/app/components/atoms/Button";
import Input from "@/app/components/atoms/Input";
import { Loader } from "@/app/components/atoms/Loader";
import { Select } from "@/app/components/atoms/Select";

interface AddDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDeckModal({ isOpen, onClose }: AddDeckModalProps) {
  const [topic, setTopic] = useState("");
  const [domain, setDomain] = useState("");
  const [lang, setLang] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const supabase = createClient();

  const createDeckMutation = useMutation({
    mutationFn: async (data: {
      topic: string;
      domain: string;
      lang?: string;
    }) => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Generate UUID for the new deck
      const deckUuid = crypto.randomUUID();

      // Create the deck
      const { error: deckError } = await supabase.from("Deck").insert({
        uuid: deckUuid,
        topic: data.topic,
        domain: data.domain,
        lang: data.lang || null,
        user_uuid: user.id,
      });

      if (deckError) throw deckError;

      return { deckUuid };
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      // Reset form and close modal
      setTopic("");
      setDomain("");
      setLang("");
      setError(null);
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || "Une erreur est survenue");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !domain.trim()) {
      setError("Le titre et le domaine sont requis");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createDeckMutation.mutateAsync({
        topic: topic.trim(),
        domain: domain.trim(),
        lang: lang.trim() || undefined,
      });
    } catch (error) {
      // Error is handled by onError callback
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Créer un nouveau deck
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Input */}
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Titre du deck *
            </label>
            <Input
              id="topic"
              type="text"
              value={topic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTopic(e.target.value)
              }
              placeholder="Ex: Mathématiques, Histoire, Langues..."
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
            />
          </div>

          <Select
            label="Domaine *"
            values={[
              { value: "Langues", label: "Langues" },
              { value: "Sciences", label: "Sciences" },
              { value: "Médecine", label: "Médecine" },
              { value: "Histoire", label: "Histoire" },
              { value: "Autre", label: "Autre" },
            ]}
            isMultiple
            isDisabled={loading}
            onChange={(values) => setDomain(String(values))}
          />

          {/* Language Input */}
          <div>
            <label
              htmlFor="lang"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Langue (optionnel)
            </label>
            <Input
              id="lang"
              type="text"
              value={lang}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLang(e.target.value)
              }
              placeholder="Ex: fr, en, es..."
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader size="xsmall" fit="content" />
                  Création...
                </div>
              ) : (
                "Créer le deck"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
