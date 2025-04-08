import classNames from "classnames";
import { useAuth } from "../../contexts/auth/Auth.hook";
import { useState } from "react";
import Button from "../Button";

interface RemoveAccountPopupProps {
  onConfirm: () => void;
  open: boolean;
  onClose: () => void;
}

function RemoveAccountPopup({
  onConfirm,
  onClose,
  open,
}: RemoveAccountPopupProps) {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  return (
    <div
      className={classNames("transition-opacity", {
        "opacity-100 pointer-events-auto": open,
        "opacity-0 pointer-events-none": !open,
      })}>
      <div onClick={onClose} className={"fixed inset-0 bg-black/50"} />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-1/2 bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Remove Account</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove {user?.email || "your account"}? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}>
            {isLoading ? "Removing..." : "Yes, Remove"}
          </Button>
          <Button variant="gray" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RemoveAccountPopup;
