import { getInitialMessages, getMessageCount, getSlideshowPhotos } from "@/lib/serverData";
import CommandCenter from "@/app/display/CommandCenter";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const [initialMessages, initialTotalCount] = await Promise.all([getInitialMessages(), getMessageCount()]);
  const photos = getSlideshowPhotos();
  return <CommandCenter initialMessages={initialMessages} initialTotalCount={initialTotalCount} photos={photos} />;
}
