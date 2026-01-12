"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useAuth } from "../../hooks/useUser";
import { createClient } from "@/lib/database/client";

import { Button } from "@/app/components/atoms/Button";
import { Input } from "@/app/components/atoms/Input";
import { Loader } from "@/app/components/atoms/Loader";
import { Select, SelectProps } from "@/app/components/atoms/Select";

import { Deck } from "../../types/types";
import { Modal } from "@/app/components/Modal";

interface AddDeckModalProps {
  isOpen: boolean;
  deckOperation: { deck?: Deck; operation: "ADD" | "UPDATE" | "DELETE" };
  onClose: () => void;
}

export const DeckModal = ({
  isOpen,
  onClose,
  deckOperation,
}: AddDeckModalProps) => {
  const t = useTranslations();
  const authentication = useAuth();
  const { deck, operation } = deckOperation;
  const router = useRouter();

  const [topic, setTopic] = useState(deck?.topic ?? "");
  const [domain, setDomain] = useState(deck?.domain ?? "");
  const [lang, setLang] = useState(deck?.lang ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LABELS = {
    ADD: {
      title: t("decks.management.upsertDeck.title"),
      loading: t("decks.management.upsertDeck.form.ctas.addingButton"),
      cta: t("decks.management.upsertDeck.form.ctas.addButton"),
    },
    UPDATE: {
      title: t("decks.management.updateDeck.title"),
      loading: t("decks.management.updateDeck.ctas.updatingButton"),
      cta: t("decks.management.updateDeck.ctas.updateButton"),
    },
    DELETE: {
      title: t("decks.management.deleteDeck.title"),
      loading: t("decks.management.deleteDeck.ctas.deletingButton"),
      cta: t("decks.management.deleteDeck.ctas.deleteButton"),
    },
  } as const;

  const domainOptions: SelectProps["values"] = [
    {
      label: t(
        "decks.management.upsertDeck.form.domain.options.languages.label"
      ),
      value: t(
        "decks.management.upsertDeck.form.domain.options.languages.value"
      ),
    },
    {
      label: t(
        "decks.management.upsertDeck.form.domain.options.sciences.label"
      ),
      value: t(
        "decks.management.upsertDeck.form.domain.options.sciences.value"
      ),
    },
    {
      label: t("decks.management.upsertDeck.form.domain.options.health.label"),
      value: t("decks.management.upsertDeck.form.domain.options.health.value"),
    },
    {
      label: t("decks.management.upsertDeck.form.domain.options.history.label"),
      value: t("decks.management.upsertDeck.form.domain.options.history.value"),
    },
    {
      label: t("decks.management.upsertDeck.form.domain.options.other.label"),
      value: t("decks.management.upsertDeck.form.domain.options.other.value"),
    },
  ];

  const queryClient = useQueryClient();
  const supabase = createClient();

  const upsertDeckMutation = useMutation({
    mutationFn: async (data: {
      topic: string;
      domain: string;
      lang?: string;
    }) => {
      const user = await authentication.getCurrentUser();
      if (!user) throw new Error(t("auth.errors.notAuthenticated"));

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
      setError(error.message || t("misc.error"));
    },
  });

  const deleteDeckMutation = useMutation({
    mutationFn: async (data: { deckUuid: string }) => {
      const user = await authentication.getCurrentUser();
      if (!user) throw new Error(t("auth.errors.notAuthenticated"));

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
      if (cardUuids.length > 0) {
        const { error: cardsError } = await supabase
          .from("Card")
          .delete()
          .eq("uuid", cardUuids);
        if (cardsError) throw cardsError;
      }

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
      setError(error.message || t("misc.error"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (operation !== "DELETE" && (!topic.trim() || !domain.trim())) {
      setError(t("decks.management.upsertDeck.form.errors.requiredFields"));
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
    <Modal isOpen={isOpen} onClose={onClose} title={LABELS[operation].title}>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {operation === "DELETE" && (
          <p>
            {t("decks.management.deleteDeck.title")}
            <br />
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
                {t("decks.management.upsertDeck.form.title.label")}
              </label>
              <Input
                id="topic"
                type="text"
                value={topic}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTopic(e.target.value)
                }
                placeholder={t(
                  "decks.management.upsertDeck.form.title.placeholder"
                )}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
              />
            </div>

            <Select
              label={t("decks.management.upsertDeck.form.domain.label")}
              values={domainOptions}
              isMultiple
              isDisabled={loading}
              onChange={(values) => setDomain(String(values))}
            />

            <div>
              <label
                htmlFor="lang"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("decks.management.upsertDeck.form.language.label")} (
                {t("misc.optional")})
              </label>
              <Input
                id="lang"
                type="text"
                value={lang}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLang(e.target.value)
                }
                placeholder={t(
                  "decks.management.upsertDeck.form.language.placeholder"
                )}
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
            {t("misc.cancel")}
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
    </Modal>
  );
};
