import classNames from "classnames";
import React from "react";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Popup({ onClose, open, children }: PopupProps) {
  return (
    <div
      className={classNames("transition-opacity", {
        "opacity-100 pointer-events-auto": open,
        "opacity-0 pointer-events-none": !open,
      })}>
      <div onClick={onClose} className={"fixed inset-0 bg-black/50"} />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-1/2 bg-white rounded-lg shadow-lg p-6 w-96">
        {children}
      </div>
    </div>
  );
}

export default Popup;
