import { useEffect, useRef, type ReactNode } from "react";

let openDialogs = 0;
let originalOverflow = "";

/** Native dialogs provide background inertness, focus containment and Escape. */
export function Modal({
  open,
  onClose,
  label,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    if (openDialogs === 0) originalOverflow = document.body.style.overflow;
    openDialogs += 1;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      openDialogs = Math.max(0, openDialogs - 1);
      if (openDialogs === 0) document.body.style.overflow = originalOverflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`native-modal ${className}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        closeRef.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeRef.current();
      }}
    >
      {open && children}
    </dialog>
  );
}
