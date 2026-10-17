import { Fragment } from "react";
import Link from "@/components/i18n/LocalizedLink";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export interface BreadcrumbItem {
  name: string;
  href?: string;
  color?: string;
}

interface FTBreadcrumbProps {
  items: BreadcrumbItem[];
  locale: Locale;
  containerClassName?: string;
  navClassName?: string;
  iconClassName?: string;
}

export default function FTBreadcrumb({
  items,
  locale,
  containerClassName = "container-editorial py-4",
  navClassName = "flex items-center gap-2 text-xs text-muted-foreground font-medium font-sans flex-wrap",
  iconClassName = "text-gray-300 shrink-0",
}: FTBreadcrumbProps) {
  return (
    <div className={containerClassName}>
      <nav aria-label="Breadcrumb" className={navClassName}>
        <Link href="/" className="hover:text-brand transition-colors">
          {locale === "ne" ? "मुख्यपृष्ठ" : "Home"}
        </Link>
        {items.map((item, idx) => (
          <Fragment key={`${item.name}-${idx}`}>
            <ChevronRight size={13} className={iconClassName} />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-brand transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span
                className="font-bold text-brand truncate"
                style={item.color ? { color: item.color } : undefined}
              >
                {item.name}
              </span>
            )}
          </Fragment>
        ))}
      </nav>
    </div>
  );
}
