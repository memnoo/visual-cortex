/**
 * DECKS
 */

export type Deck = {
  uuid: string;
  created_at: number;
  topic: string;
  lang?: string;
  domain: string;
  user_uuid: string;
};

export type DeckWithCount = Deck & {
  count: number;
};

export interface CreateDeckInput {
  topic: string;
  lang?: string;
  domain: string;
  user_uuid: string;
}

export interface UpdateDeckInput {
  uuid: string;
  topic: string;
  lang?: string;
  domain: string;
}

/**
 * CARDS
 */

export type Card = {
  uuid: string;
  created_at: number;
  front: string;
  back: string;
  content: JSON;
  user_uuid: string;
};

export interface CreateCardInput {
  front: string;
  back: string;
  content: string;
  user_uuid: string;
}

export interface UpdateCardInput {
  uuid: string;
  front: string;
  back: string;
  content: string;
}
