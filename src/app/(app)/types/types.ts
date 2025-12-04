import {
  Deck as RawDeck,
  DeckWithCount as RawDeckWithCount,
  Card as RawCard,
} from "@/lib/types/database";

export type Card = {
  uuid: string;
  front: string;
  back: string;
  extraFields?: JSON;
  createdAt: Date;
  userUuid: string;
};

export type Deck = {
  uuid: string;
  topic: string;
  domain: string;
  lang?: string;
  createdAt: Date;
  userUuid: string;
};

export interface DeckWithCards extends Deck {
  cards: Card[];
}

export interface DeckWithCount extends Deck {
  count: number;
}

export const transformCard = (rawCard: RawCard): Card => ({
  uuid: rawCard.uuid,
  front: rawCard.front,
  back: rawCard.back,
  extraFields: rawCard.content,
  createdAt: new Date(rawCard.created_at),
  userUuid: rawCard.user_uuid,
});

export const transformDeck = (rawDeck: RawDeck): Deck => ({
  uuid: rawDeck.uuid,
  topic: rawDeck.topic,
  domain: rawDeck.domain,
  lang: rawDeck.lang,
  createdAt: new Date(rawDeck.created_at),
  userUuid: rawDeck.user_uuid,
});

export const transformDeckWithCount = (
  rawDeck: RawDeckWithCount
): DeckWithCount => ({
  uuid: rawDeck.uuid,
  topic: rawDeck.topic,
  domain: rawDeck.domain,
  lang: rawDeck.lang,
  createdAt: new Date(rawDeck.created_at),
  userUuid: rawDeck.user_uuid,
  count: rawDeck.count,
});

export const transformDeckWithCards = (
  rawDeck: RawDeck,
  rawCards: RawCard[]
): DeckWithCards => ({
  uuid: rawDeck.uuid,
  topic: rawDeck.topic,
  domain: rawDeck.domain,
  lang: rawDeck.lang,
  createdAt: new Date(rawDeck.created_at),
  userUuid: rawDeck.user_uuid,
  cards: (rawCards ?? []).map(transformCard),
});
