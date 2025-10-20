export type Card = {
  uuid: string;
  front: string;
  back: string;
  extraFields?: Record<string, string | number | boolean>;
  createdAt: Date;
  userUuid: string;
};

export type Deck = {
  uuid: string;
  topic: string;
  domain: string;
  lang?: string;
  count: number;
  createdAt: Date;
  userUuid: string;
};
