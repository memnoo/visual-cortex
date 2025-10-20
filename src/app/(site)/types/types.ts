type WaitlistEntry = {
  uuid: string;
  email: string;
  interest: string;
  status: "pending" | "joined";
  createdAt: string;
  joinedAt?: string;
};
