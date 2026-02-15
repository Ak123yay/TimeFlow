import { useEffect, useRef } from "react";
import "../../App.css";

export default function DialogBase({ isOpen, onClose, title, children, maxWidth = "500px" }) {
  const dialogRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Focus first focusable element
    const focusable = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      firstFocusableRef.current = focusable[0];
      focusable[0].focus();
    }

    // Trap focus within dialog
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

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
    };

    dialog.addEventListener('keydown', handleTab);
    return () => dialog.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn 0.2s ease-out"
      }}
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        style={{
          background: "#fff",
          padding: "28px",
          borderRadius: "20px",
          width: "92%",
          maxWidth,
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
          animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        {title && (
          <h2
            id="dialog-title"
            style={{
              fontSize: "24px",
              fontWeight: "900",
              color: "#123a12",
              marginBottom: "16px",
              marginTop: 0
            }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
