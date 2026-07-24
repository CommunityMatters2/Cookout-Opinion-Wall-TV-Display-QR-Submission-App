import { Camera, Ticket, Heart, Vote } from "lucide-react";

// Shared between the pitch card (pre-signup) and the account home page
// (post-signup "why this account?" recap) so the two never drift apart.
export const insiderBenefits = [
  { icon: Camera, text: "Get featured on the wall with your name & photo" },
  { icon: Ticket, text: "Early invites to CM2 events" },
  { icon: Heart, text: "Follow the community center journey" },
  { icon: Vote, text: "Vote in future Community Voice polls" },
];
