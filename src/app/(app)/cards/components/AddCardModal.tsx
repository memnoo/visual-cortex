"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/database/client";
import Button from "@/app/components/atoms/Button";
import Input from "@/app/components/atoms/Input";
import { Loader } from "@/app/components/atoms/Loader";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckUuid: string;
}

export const AddCardModal = ({
  isOpen,
  onClose,
  deckUuid,
}: AddCardModalProps) => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [content, setContent] = useState("{}");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const supabase = createClient();

  const createCardMutation = useMutation({
    mutationFn: async (data: {
      front: string;
      back: string;
      content: Record<string, unknown>;
    }) => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create the card
      const cardUuid = crypto.randomUUID();
      const { error: cardError } = await supabase.from("Card").insert({
        uuid: cardUuid,
        front: data.front,
        back: data.back,
        content: data.content,
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
      setContent("{}");
      setJsonError(null);
      setError(null);
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || "An error occurred");
    },
  });

  const handleContentChange = (value: string) => {
    setContent(value);

    // Validate JSON
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e) {
      setJsonError("Invalid JSON");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) {
      setError("Front and back of the card are required");
      return;
    }

    let json: Record<string, unknown>;
    try {
      json = JSON.parse(content);
    } catch (e) {
      setError("The JSON content is invalid");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createCardMutation.mutateAsync({ front, back, content: json });
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
            Add a new flash-card
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
              placeholder="Front of the card"
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
              placeholder="What is at the back of the card"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
            />
          </div>
          {/* JSON Content Editor */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content (JSON format)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder='{"key": "value"}'
              disabled={loading}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 font-mono text-sm"
            />
            {jsonError && (
              <p className="text-sm text-red-600 mt-1">{jsonError}</p>
            )}
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
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !!jsonError}
              className="flex-1"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader size="xsmall" fit="content" />
                  Adding the card...
                </div>
              ) : (
                "Add flash-card"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
