import type { RecommendationTag, RiskLevel } from "@/types";
import { formatRecommendationLabel } from "@/lib/formatters";
import { Star, TrendingUp, AlertTriangle, DollarSign, Building2 } from "lucide-react";
import styles from "./RecommendationBadge.module.css";

interface RecommendationBadgeProps {
  tag: RecommendationTag;
  risk: RiskLevel;
}

const TAG_CONFIG: Record<
  RecommendationTag,
  { icon: React.ElementType; variant: string }
> = {
  recommended:     { icon: Star,          variant: "recommended" },
  "best-value":    { icon: TrendingUp,    variant: "bestValue" },
  "high-risk":     { icon: AlertTriangle, variant: "highRisk" },
  "high-cost":     { icon: DollarSign,    variant: "highCost" },
  "enterprise-fit":{ icon: Building2,     variant: "enterprise" },
};

export function RecommendationBadge({ tag }: RecommendationBadgeProps) {
  const { icon: Icon, variant } = TAG_CONFIG[tag];

  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      <Icon size={11} aria-hidden="true" />
      {formatRecommendationLabel(tag)}
    </span>
  );
}
