import type { ReactNode } from "react";
import { getInitialMessages, getSlideshowPhotos } from "@/lib/serverData";
import { PhotosProvider } from "@/lib/hooks/usePhotos";
import WallShell from "@/app/wall/WallShell";

export const dynamic = "force-dynamic";

export default async function WallLayout({ children }: { children: ReactNode }) {
  const initialMessages = await getInitialMessages();
  const photos = getSlideshowPhotos();

  return (
    <PhotosProvider photos={photos}>
      <WallShell initialMessages={initialMessages}>{children}</WallShell>
    </PhotosProvider>
  );
}
