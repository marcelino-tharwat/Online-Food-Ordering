import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { X, Loader2 } from "lucide-react";

type ModalVariant = "form" | "confirmation" | "loading";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  variant?: ModalVariant;
  maxWidth?: string;
  closeOnOverlay?: boolean;
  footer?: ReactNode;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = "form",
  maxWidth = "max-w-md",
  closeOnOverlay = true,
  footer,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: MouseEvent) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {variant === "loading" ? (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="bg-white border border-border-light rounded-2xl p-12 flex items-center justify-center shadow-lg animate-scale-in"
          style={{ maxWidth }}
        >
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="bg-white border border-border-light rounded-2xl w-full shadow-lg max-h-[90vh] overflow-y-auto animate-scale-in outline-none"
          style={{ maxWidth }}
        >
          {title && (
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-light">
              <h2
                id="modal-title"
                className="text-lg font-bold text-text-primary"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 border border-border-light rounded-md hover:bg-accent/50 transition-all flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          )}

          <div className="p-6">{children}</div>

          {footer && (
            <div className="px-6 pb-6 pt-0">{footer}</div>
          )}
        </div>
      )}
    </div>
  );
}

export { Modal, type ModalProps, type ModalVariant };
