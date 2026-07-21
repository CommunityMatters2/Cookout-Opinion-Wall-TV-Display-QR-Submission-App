"use client";

import { createContext, useContext, type ReactNode } from "react";

const PhotosContext = createContext<string[]>([]);

// The slideshow photo list is read from disk server-side (see lib/serverData.ts)
// and only available at the page root — this context hands it to any
// self-contained widget (Photo Moments summary + detail) without threading
// props through the registry, matching how every other widget reads its data
// via a hook rather than props.
export function PhotosProvider({ photos, children }: { photos: string[]; children: ReactNode }) {
  return <PhotosContext.Provider value={photos}>{children}</PhotosContext.Provider>;
}

export function usePhotos(): string[] {
  return useContext(PhotosContext);
}
