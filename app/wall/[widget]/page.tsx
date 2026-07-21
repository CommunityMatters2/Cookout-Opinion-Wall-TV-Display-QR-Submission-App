"use client";

import { use, useEffect, useRef } from "react";
import { ViewTransition } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getWidget } from "@/lib/widgets/registry";
import ShareButton from "@/app/wall/ShareButton";
import styles from "../wall.module.css";

const SWIPE_CLOSE_THRESHOLD = 90;

export default function WallWidgetPage({ params }: { params: Promise<{ widget: string }> }) {
  const { widget: widgetId } = use(params);
  const widget = getWidget(widgetId);

  const router = useRouter();
  const startY = useRef<number | null>(null);

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      startY.current = e.touches[0].clientY;
    }
    function handleTouchEnd(e: TouchEvent) {
      if (startY.current === null) return;
      const delta = e.changedTouches[0].clientY - startY.current;
      startY.current = null;
      if (delta > SWIPE_CLOSE_THRESHOLD && window.scrollY <= 0) {
        router.push("/wall");
      }
    }
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [router]);

  if (!widget) notFound();

  const Detail = widget.Detail;
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/wall/${widget.id}` : `/wall/${widget.id}`;

  return (
    <div className={styles.detailRoot}>
      <div className={styles.detailTopRow}>
        <Link href="/wall" transitionTypes={["nav-back"]} className={styles.detailBack}>
          <ArrowLeft size={18} /> Back
        </Link>
        <ShareButton title={`CM2 Live Wall — ${widget.title}`} url={shareUrl} />
      </div>
      <ViewTransition name={`widget-${widget.id}`}>
        <div className={styles.detailContent}>
          <Detail />
        </div>
      </ViewTransition>
    </div>
  );
}
