import Link from "next/link";
import { clsx } from "clsx";

type Props = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md";
};

const base = "border border-charcoal text-charcoal uppercase tracking-wide rounded-none transition-colors duration-subtle hover:bg-gold hover:border-gold hover:text-charcoal";

export function LuxuryButton({ children, href, className, type = "button", size = "md" }: Props) {
  const sizeClass = size === "sm" ? "px-3 py-2 text-xs" : "px-6 py-2 text-sm";
  const classes = clsx(base, sizeClass, className);
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}


