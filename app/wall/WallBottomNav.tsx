"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, BarChart3, BookOpen } from "lucide-react";
import { siteConfig } from "@/config/site";
import styles from "./wall.module.css";

function scrollToAnchor(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function WallBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  function goHomeThenScroll(id?: string) {
    if (pathname !== "/wall") {
      router.push(id ? `/wall?scrollTo=${id}` : "/wall");
      return;
    }
    if (id) scrollToAnchor(id);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <nav className={styles.bottomNav} aria-label="Wall navigation">
      <button type="button" className={styles.bottomNavItem} onClick={() => goHomeThenScroll()}>
        <Home size={20} />
        <span>Live</span>
      </button>
      <button type="button" className={styles.bottomNavItem} onClick={() => goHomeThenScroll("impact")}>
        <BarChart3 size={20} />
        <span>Impact</span>
      </button>
      <button type="button" className={styles.bottomNavItem} onClick={() => goHomeThenScroll("about")}>
        <BookOpen size={20} />
        <span>About CM2</span>
      </button>
      <a
        href={siteConfig.cm2.donateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.bottomNavItem} ${styles.bottomNavDonate}`}
      >
        <span aria-hidden="true">💛</span>
        <span>Donate</span>
      </a>
    </nav>
  );
}
