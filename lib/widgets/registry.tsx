import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import { Vote, TrendingUp, CalendarClock, LayoutGrid, Tent, PiggyBank, HeartPulse, Camera, type LucideIcon } from "lucide-react";
import CommunityVoiceSummary from "@/app/display/widgets/CommunityVoiceSummary";
import ImpactSummary from "@/app/display/widgets/ImpactSummary";
import JourneySummary from "@/app/display/widgets/JourneySummary";
import ProgramsSummary from "@/app/display/widgets/ProgramsSummary";
import SummerCampSummary from "@/app/display/widgets/SummerCampSummary";
import ROISummary from "@/app/display/widgets/ROISummary";
import WhySummerSummary from "@/app/display/widgets/WhySummerSummary";
import PhotoMomentsSummary from "@/app/display/widgets/PhotoMomentsSummary";

export type WidgetId =
  | "community-voice"
  | "impact"
  | "journey"
  | "programs"
  | "summer-camp"
  | "roi"
  | "why-summer"
  | "photo-moments";

export type WidgetDef = {
  id: WidgetId;
  title: string;
  icon: LucideIcon;
  accent: string;
  Summary: ComponentType;
  Detail: ComponentType;
};

// Detail scenes are dynamically imported (code-split, loaded on demand)
// rather than statically imported — /wall and /display otherwise ship all 8
// scenes' JS up front even though only one Detail is ever shown at a time.
const CommunityVoiceScene = dynamic(() => import("@/app/display/scenes/CommunityVoiceScene"), { ssr: false });
const GrowthTimelineScene = dynamic(() => import("@/app/display/scenes/GrowthTimelineScene"), { ssr: false });
const SignatureProgramsScene = dynamic(() => import("@/app/display/scenes/SignatureProgramsScene"), { ssr: false });
const SummerCampScene = dynamic(() => import("@/app/display/scenes/SummerCampScene"), { ssr: false });
const ROIScene = dynamic(() => import("@/app/display/scenes/ROIScene"), { ssr: false });
const WhySummerMattersScene = dynamic(() => import("@/app/display/scenes/WhySummerMattersScene"), { ssr: false });
const ImpactDetail = dynamic(() => import("@/app/display/widgets/ImpactDetail"), { ssr: false });
const PhotoGalleryDetail = dynamic(() => import("@/app/display/widgets/PhotoGalleryDetail"), { ssr: false });

// The single source of truth for the 8 widgets — both the TV Explore Zone grid
// and the mobile stacked cards / `/wall/[widget]` deep links read from this one
// array, so every surface always shows the same widgets in the same order.
export const widgetRegistry: WidgetDef[] = [
  {
    id: "community-voice",
    title: "Community Voice",
    icon: Vote,
    accent: "#F5A623",
    Summary: CommunityVoiceSummary,
    Detail: CommunityVoiceScene,
  },
  {
    id: "impact",
    title: "Impact by the Numbers",
    icon: TrendingUp,
    accent: "#FF6B35",
    Summary: ImpactSummary,
    Detail: ImpactDetail,
  },
  {
    id: "journey",
    title: "Our Journey",
    icon: CalendarClock,
    accent: "#1E9FB3",
    Summary: JourneySummary,
    Detail: GrowthTimelineScene,
  },
  {
    id: "programs",
    title: "Signature Programs",
    icon: LayoutGrid,
    accent: "#8452D9",
    Summary: ProgramsSummary,
    Detail: SignatureProgramsScene,
  },
  {
    id: "summer-camp",
    title: "Summer Camp",
    icon: Tent,
    accent: "#43A75B",
    Summary: SummerCampSummary,
    Detail: SummerCampScene,
  },
  {
    id: "roi",
    title: "Return on Investment",
    icon: PiggyBank,
    accent: "#F5A623",
    Summary: ROISummary,
    Detail: ROIScene,
  },
  {
    id: "why-summer",
    title: "Why Summer Matters",
    icon: HeartPulse,
    accent: "#FF5A5F",
    Summary: WhySummerSummary,
    Detail: WhySummerMattersScene,
  },
  {
    id: "photo-moments",
    title: "Photo Moments",
    icon: Camera,
    accent: "#FFD166",
    Summary: PhotoMomentsSummary,
    Detail: PhotoGalleryDetail,
  },
];

export function getWidget(id: string): WidgetDef | undefined {
  return widgetRegistry.find((w) => w.id === id);
}
