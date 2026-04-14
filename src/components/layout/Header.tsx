import { BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header} role="banner">
      <div className={`container ${styles.inner}`}>
        <div className={styles.logo} aria-label="Component Cost Calculator">
          <BarChart3 size={22} aria-hidden="true" className={styles.logoIcon} />
          <span className={styles.logoText}>Component Cost Calculator</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
