export type WaitlistEntry = {
  uuid: string;
  email: string;
  interest?: string;
  status: "pending" | "joined";
  createdAt: Date;
  joinedAt?: Date;
};

export type RawWaitlistData = {
  uuid: string;
  email: string;
  interest?: string;
  status: "pending" | "joined";
  created_at: string;
  joined_at: string;
};

export const getWaitlistEntry = (rawData: RawWaitlistData): WaitlistEntry => ({
  uuid: rawData.uuid,
  email: rawData.email,
  interest: rawData.interest,
  status: rawData.status,
  createdAt: new Date(rawData.created_at),
  joinedAt: rawData.joined_at ? new Date(rawData.joined_at) : undefined,
});
