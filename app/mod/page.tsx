import { redirect } from "next/navigation";
import { hasValidModSession } from "@/lib/modSession";
import { getModerationQueue } from "@/lib/actions/moderation";
import ModerationQueue from "@/app/mod/ModerationQueue";

export const dynamic = "force-dynamic";

export default async function ModPage() {
  if (!(await hasValidModSession())) {
    redirect("/mod/login");
  }

  const { pending, approved } = await getModerationQueue();
  return <ModerationQueue initialPending={pending} initialApproved={approved} />;
}
