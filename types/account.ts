export type Account = {
  id: string;
  name: string;
  contact: string;
  contact_type: "email" | "phone";
  featured: boolean;
  created_at: string;
};
