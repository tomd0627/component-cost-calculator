import { ExternalLink } from "lucide-react";
import styles from "./Footer.module.css";

const SOURCES = [
  {
    label: "Deque Systems — Business Case for Accessibility",
    href: "https://www.deque.com/blog/the-business-case-for-digital-accessibility/",
  },
  {
    label: "WebAIM Million Report",
    href: "https://webaim.org/projects/million/",
  },
  {
    label: "Nielsen Norman Group — Design Systems ROI",
    href: "https://www.nngroup.com/articles/design-systems-roi/",
  },
  {
    label: "Smashing Magazine — Design Systems Handbook",
    href: "https://www.designbetter.co/design-systems-handbook",
  },
];

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <p className={styles.byline}>
          Built with Next.js · Estimates based on published industry research
        </p>
        <nav aria-label="Research sources">
          <ul className={styles.sources}>
            {SOURCES.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceLink}
                >
                  {label}
                  <ExternalLink size={12} aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
