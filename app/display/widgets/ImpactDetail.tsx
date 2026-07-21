import { impactNumbers } from "@/content/cm2Impact";
import ImpactStatsScene from "@/app/display/scenes/ImpactStatsScene";

// The rotation-era stage only ever showed one pre-chunked page of the 13 impact
// numbers at a time (see impactNumberPages in content/cm2Impact.ts). The widget
// detail view has room to show all of them at once, so this wrapper just skips
// the chunking entirely rather than reusing the paged rotation logic.
export default function ImpactDetail() {
  return <ImpactStatsScene stats={impactNumbers} />;
}
