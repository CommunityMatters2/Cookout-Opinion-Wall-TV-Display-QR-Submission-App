export type MessageStatus = "approved" | "pending" | "rejected";

export type Message = {
  id: string;
  name: string;
  message: string;
  status: MessageStatus;
  created_at: string;
  account_id?: string | null;
};
