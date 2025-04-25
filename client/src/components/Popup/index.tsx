import classNames from "classnames";
import React from "react";
import ReactDOM from "react-dom";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Popup({ onClose, open, children }: PopupProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "visible";
    }

    return () => {
      document.body.style.overflowY = "visible";
    };
  }, [open]);

  return ReactDOM.createPortal(
    <div
      className={classNames("transition-opacity", {
        "opacity-100 pointer-events-auto": open,
        "opacity-0 pointer-events-none": !open,
      })}>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-1/2 bg-white rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Popup;
