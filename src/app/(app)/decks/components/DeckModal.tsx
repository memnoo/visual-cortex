"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/database/client";
import Button from "@/app/components/atoms/Button";
import Input from "@/app/components/atoms/Input";
import { Loader } from "@/app/components/atoms/Loader";
import { Select } from "@/app/components/atoms/Select";
import { Deck } from "../../types/types";
import { useAuth } from "../../hooks/useUser";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/atoms/Icon";

interface AddDeckModalProps {
  isOpen: boolean;
  deckOperation: { deck?: Deck; operation: "ADD" | "UPDATE" | "DELETE" };
  onClose: () => void;
}

const LABELS = {
  ADD: {
    title: "Add a new deck",
    loading: "Adding",
    cta: "Add the deck",
  },
  UPDATE: {
    title: "Edit a deck",
    loading: "Editing",
    cta: "Edit the deck",
  },
  DELETE: {
    title: "Delete a deck",
    loading: "Deletion",
    cta: "Delete a deck",
  },
} as const;

export const DeckModal = ({
  isOpen,
  onClose,
  deckOperation,
}: AddDeckModalProps) => {
  const authentication = useAuth();
  const { deck, operation } = deckOperation;
  const router = useRouter();

  const [topic, setTopic] = useState(deck?.topic ?? "");
  const [domain, setDomain] = useState(deck?.domain ?? "");
  const [lang, setLang] = useState(deck?.lang ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const supabase = createClient();

  const upsertDeckMutation = useMutation({
    mutationFn: async (data: {
      topic: string;
      domain: string;
      lang?: string;
    }) => {
      const user = await authentication.getCurrentUser();
      if (!user) throw new Error("User not authenticated");

      // Generate UUID for the new deck
      const deckUuid = deck?.uuid ?? crypto.randomUUID();

      const payload = {
        uuid: deckUuid,
        topic: data.topic,
        domain: data.domain,
        lang: data.lang || null,
        user_uuid: deck?.userUuid ?? user.id,
      };

      const { error } = await supabase.from("Deck").upsert(payload);
      if (error) throw error;
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
      setError(error.message || "An error occurred");
    },
  });

  const deleteDeckMutation = useMutation({
    mutationFn: async (data: { deckUuid: string }) => {
      const user = await authentication.getCurrentUser();
      if (!user) throw new Error("User not authenticated");

      // TOFIX Make transactional

      // Fetch cards associated with the deck
      const { data: cardResults, error: deckCardsError } = await supabase
        .from("deck_card_association")
        .select("card_uuid")
        .eq("deck_uuid", data.deckUuid);
      if (deckCardsError) throw deckCardsError;

      const cardUuids = cardResults?.map((r) => r.card_uuid) || [];

      // Delete associations
      const { error: cardDeckAssociationError } = await supabase
        .from("deck_card_association")
        .delete()
        .eq("deck_uuid", data.deckUuid);
      if (cardDeckAssociationError) throw cardDeckAssociationError;

      // Delete cards
      const { error: cardsError } = await supabase
        .from("Card")
        .delete()
        .eq("uuid", cardUuids);
      if (cardsError) throw cardsError;

      // Delete the deck
      const { error: deckError } = await supabase
        .from("Deck")
        .delete()
        .eq("uuid", data.deckUuid);
      if (deckError) throw deckError;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["decks", deck?.uuid] });

      setTopic("");
      setDomain("");
      setLang("");
      setError(null);
      onClose();

      router.push("/decks");
    },
    onError: (error: any) => {
      setError(error.message || "An error occurred");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (operation !== "DELETE" && (!topic.trim() || !domain.trim())) {
      setError("Title and domain are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (operation === "DELETE" && deck) {
        await deleteDeckMutation.mutateAsync({ deckUuid: deck.uuid });
      } else {
        await upsertDeckMutation.mutateAsync({
          topic: topic.trim(),
          domain: domain.trim(),
          lang: lang.trim() || undefined,
        });
      }
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
            {LABELS[operation].title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <Icon name="cross" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {operation === "DELETE" && (
            <p>
              Would you like to delete the deck : <br />
              <strong>{deck?.topic}</strong>
            </p>
          )}

          {["ADD", "UPDATE"].includes(operation) && (
            <>
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title *
                </label>
                <Input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTopic(e.target.value)
                  }
                  placeholder="Ex: Maths, History, Language..."
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                />
              </div>

              <Select
                label="Domain *"
                values={[
                  { value: "Languages", label: "Languages" },
                  { value: "Sciences", label: "Sciences" },
                  { value: "Health", label: "Health" },
                  { value: "History", label: "History" },
                  { value: "Other", label: "Other" },
                ]}
                isMultiple
                isDisabled={loading}
                onChange={(values) => setDomain(String(values))}
              />

              <div>
                <label
                  htmlFor="lang"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Language (optional)
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
            </>
          )}
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
              Cancel
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
                  {LABELS[operation].loading}
                </div>
              ) : (
                LABELS[operation].cta
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
