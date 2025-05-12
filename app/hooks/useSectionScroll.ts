import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

/**
 * Hook for scrolling to page sections by ID with React Router hash navigation.
 * Updates the URL hash and scrolls smoothly to the target section.
 *
 * @param opts Optional configuration:
 *   - setMobileOpen: Function to close mobile navigation after scrolling
 *   - autoScrollOnHash: If true, auto-scrolls to section when URL hash changes (default: false)
 * @returns scrollToSection: Callback to scroll to a section by ID or via click event
 */
type SectionScrollOptions = {
  setMobileOpen?: (open: boolean) => void;
  autoScrollOnHash?: boolean;
};

/**
 * If called with a section id/hash, returns a stable click handler for that destination.
 * If called with no argument, returns a generic event handler (legacy mode).
 */
export function useSectionScroll(
  sectionIdOrOpts?: string | SectionScrollOptions,
  maybeOpts?: SectionScrollOptions
) {
    const navigate = useNavigate();
  const { hash } = useLocation();

  // Normalize arguments
  let sectionId: string | undefined;
  let opts: SectionScrollOptions | undefined;
  if (typeof sectionIdOrOpts === "string") {
    sectionId = sectionIdOrOpts;
    opts = maybeOpts;
  } else {
    opts = sectionIdOrOpts;
  }

  // Handler for a specific section
  const handlerForSection = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const cleanId = sectionId!.replace(/^#/, "");
      navigate(`/#${cleanId}`);
      if (opts?.setMobileOpen) opts.setMobileOpen(false);
    },
    [navigate, opts?.setMobileOpen, sectionId]
  );

  // Generic handler (legacy mode)
  const genericHandler = useCallback(
    (eOrId: React.MouseEvent<HTMLElement> | string) => {
      let id: string;
      if (typeof eOrId === "string") {
        id = eOrId;
      } else {
        eOrId.preventDefault();
        const target = eOrId.currentTarget;
        const href = target.getAttribute("href");
        id = href && href.startsWith("#") ? href.slice(1) : "";
      }
      const cleanId = id.replace(/^#/, "");
      navigate(`/#${cleanId}`);
      if (opts?.setMobileOpen) opts.setMobileOpen(false);
    },
    [navigate, opts?.setMobileOpen]
  );

  // Auto-scroll when hash changes (if enabled)
  useEffect(() => {
    if (!opts?.autoScrollOnHash) return;
    if (hash) {
      const id = hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash, opts?.autoScrollOnHash]);

  // If a section id is provided, return a handler for that section
  if (sectionId) return handlerForSection;
  // Otherwise, return the generic handler
  return genericHandler;
}