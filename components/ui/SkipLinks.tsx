"use client";

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#search', label: 'Skip to search' },
  { href: '#footer', label: 'Skip to footer' }
];

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  return (
    <div className="skip-links">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector(link.href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // Set focus to the target element
              const focusTarget = target as HTMLElement;
              if (focusTarget.tabIndex === -1) {
                focusTarget.tabIndex = -1;
              }
              focusTarget.focus();
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}