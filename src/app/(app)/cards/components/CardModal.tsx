"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useAuth } from "../../hooks/useUser";
import { createClient } from "@/lib/database/client";

import { Button } from "@/app/components/atoms/Button";
import { Input } from "@/app/components/atoms/Input";
import { Loader } from "@/app/components/atoms/Loader";
import { Modal } from "@/app/components/Modal";

import { Card } from "../../types/types";

interface CardModalProps {
  isOpen: boolean;
  deckUuid: string;
  cardOperation: { card?: Card; operation: "ADD" | "UPDATE" | "DELETE" };
  onClose: () => void;
}

export const CardModal = ({
  isOpen,
  deckUuid,
  cardOperation,
  onClose,
}: CardModalProps) => {
  const t = useTranslations();
  const authentication = useAuth();
  const { card, operation } = cardOperation;

  const [front, setFront] = useState(card?.front ?? "");
  const [back, setBack] = useState(card?.back ?? "");
  const [content, setContent] = useState(
    JSON.stringify(card?.extraFields) ?? "{}"
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LABELS = {
    ADD: {
      title: t("cards.management.upsertCard.title"),
      loading: t("cards.management.upsertCard.form.ctas.addingButton"),
      cta: t("cards.management.upsertCard.form.ctas.addButton"),
    },
    UPDATE: {
      title: t("cards.management.updateCard.title"),
      loading: t("cards.management.updateCard.ctas.updatingButton"),
      cta: t("cards.management.updateCard.ctas.updateButton"),
    },
    DELETE: {
      title: t("cards.management.deleteCard.title"),
      loading: t("cards.management.deleteCard.ctas.deletingButton"),
      cta: t("cards.management.deleteCard.ctas.deleteButton"),
    },
  } as const;

  const queryClient = useQueryClient();
  const supabase = createClient();

  const upsertCardMutation = useMutation({
    mutationFn: async (data: {
      front: string;
      back: string;
      content: Record<string, unknown>;
    }) => {
      const user = await authentication.getCurrentUser();
      if (!user) throw new Error(t("auth.errors.notAuthenticated"));

      // Generate UUID for the new card
      const cardUuid = card?.uuid ?? crypto.randomUUID();

      const payload = {
        uuid: cardUuid,
        front: data.front,
        back: data.back,
        content: data.content,
        user_uuid: user.id,
      };

      const { error: cardError } = await supabase.from("Card").upsert(payload);
      if (cardError) throw cardError;

      // Create the association to deck
      if (!card) {
        const { error: linkError } = await supabase
          .from("deck_card_association")
          .insert({
            deck_uuid: deckUuid,
            card_uuid: cardUuid,
          });
        if (linkError) throw linkError;
      }
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
      setError(error.message || t("misc.error"));
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (data: { cardUuid: string }) => {
      const user = await authentication.getCurrentUser();
      if (!user) throw new Error(t("auth.errors.notAuthenticated"));

      // TOFIX Make transactional

      // Delete association
      const { error: cardDeckAssociationError } = await supabase
        .from("deck_card_association")
        .delete()
        .eq("card_uuid", data.cardUuid);
      if (cardDeckAssociationError) throw cardDeckAssociationError;

      // Delete card
      const { error: cardError } = await supabase
        .from("Card")
        .delete()
        .eq("uuid", data.cardUuid);
      if (cardError) throw cardError;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["cards", card?.uuid] });

      setFront("");
      setBack("");
      setContent("{}");
      setJsonError(null);
      setError(null);
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || t("misc.error"));
    },
  });

  const handleContentChange = (value: string) => {
    setContent(value);

    // Validate JSON
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e) {
      setJsonError(t("cards.management.upsertCard.form.content.error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (operation !== "DELETE" && (!front.trim() || !back.trim())) {
      setError(t("cards.management.upsertCard.form.errors.requiredFields"));
      return;
    }

    let json: Record<string, unknown>;
    try {
      json = JSON.parse(content);
    } catch (e) {
      setError(t("cards.management.upsertCard.form.errors.invalidJson"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await upsertCardMutation.mutateAsync({ front, back, content: json });

      if (operation === "DELETE" && card) {
        await deleteCardMutation.mutateAsync({ cardUuid: card.uuid });
      } else {
        await upsertCardMutation.mutateAsync({
          front,
          back,
          content: json,
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
    <Modal isOpen={isOpen} onClose={onClose} title={LABELS[operation].title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {operation === "DELETE" && (
          <p>
            {t("cards.management.deleteCard.title")}
            <br />
            <strong>{card?.front}</strong>
          </p>
        )}

        {["ADD", "UPDATE"].includes(operation) && (
          <>
            <div>
              <label
                htmlFor="front"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("cards.management.upsertCard.form.front.label")} *
              </label>
              <Input
                id="front"
                type="text"
                value={front}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFront(e.target.value)
                }
                placeholder={t(
                  "cards.management.upsertCard.form.front.placeholder"
                )}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="back"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("cards.management.upsertCard.form.back.label")} *
              </label>
              <Input
                id="back"
                type="text"
                value={back}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBack(e.target.value)
                }
                placeholder={t(
                  "cards.management.upsertCard.form.back.placeholder"
                )}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("cards.management.upsertCard.form.content.label")} *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={t(
                  "cards.management.upsertCard.form.content.placeholder"
                )}
                disabled={loading}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 font-mono text-sm"
              />
              {jsonError && (
                <p className="text-sm text-red-600 mt-1">{jsonError}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {t("misc.cancel")}
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
                {LABELS[operation].loading}
              </div>
            ) : (
              LABELS[operation].cta
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
