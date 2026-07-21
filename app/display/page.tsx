import { getInitialMessages, getSlideshowPhotos } from "@/lib/serverData";
import CommandCenter from "@/app/display/CommandCenter";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const initialMessages = await getInitialMessages();
  const photos = getSlideshowPhotos();
  return <CommandCenter initialMessages={initialMessages} photos={photos} />;
}
