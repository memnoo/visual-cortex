"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/database/client";
import Button from "@/app/components/atoms/Button";
import Input from "@/app/components/atoms/Input";
import { Loader } from "@/app/components/atoms/Loader";
import { Select } from "@/app/components/atoms/Select";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckUuid: string;
}

export default function AddCardModal({
  isOpen,
  onClose,
  deckUuid,
}: AddCardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const supabase = createClient();

  const createCardMutation = useMutation({
    mutationFn: async (data: { front: string; back: string }) => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create the card
      const cardUuid = crypto.randomUUID();
      const { error: cardError } = await supabase.from("Card").insert({
        uuid: cardUuid,
        ...data,
        content: "",
        user_uuid: user.id,
      });

      if (cardError) throw cardError;

      // Create the association to deck
      const { error: linkError } = await supabase
        .from("deck_card_association")
        .insert({
          deck_uuid: deckUuid,
          card_uuid: cardUuid,
        });

      if (linkError) throw linkError;

      return cardUuid;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      // Reset form and close modal
      setFront("");
      setBack("");
      setError(null);
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || "Une erreur est survenue");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) {
      setError("Le recto et le verso de la carte sont requis");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createCardMutation.mutateAsync({
        front,
        back,
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
            Créer une nouvelle flash card
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
          {/* Front Input */}
          <div>
            <label
              htmlFor="front"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Front *
            </label>
            <Input
              id="front"
              type="text"
              value={front}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFront(e.target.value)
              }
              placeholder="Recto de la carte"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
            />
          </div>

          {/* Back Input */}
          <div>
            <label
              htmlFor="back"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Back *
            </label>
            <Input
              id="back"
              type="text"
              value={back}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBack(e.target.value)
              }
              placeholder="Ce qui est au recto de la carte"
              required
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
                "Créer la flash card"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
