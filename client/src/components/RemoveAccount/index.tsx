import React from "react";
import { useNavigate } from "react-router-dom";
import { removeAccount } from "../../services/api-requests/auth/removeAccount";
import { toast } from "react-toastify";
import { routes } from "../../constants/routes";
import { useAuth } from "../../contexts/auth/Auth.hook";
import { useState } from "react";
import Button from "../Button";
import Popup from "../Popup";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

function RemoveAccount() {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handlePopup = (open: boolean) => () => {
    setOpenPopup(open);
  };

  const handleRemoveSubmit = async () => {
    setIsLoading(true);

    const res = await removeAccount();

    setIsLoading(false);

    console.log("before toast if", res);
    if (handleResultWithToast(res) !== undefined) {
      console.log("before toast");
      toast.success("Account has been removed!");
      console.log("after toast");
      navigate(routes.home);
    }
  };

  return (
    <>
      <Button onClick={handlePopup(true)} variant="destructiveOutlined">
        Remove account
      </Button>

      <Popup open={openPopup} onClose={handlePopup(false)}>
        <div className="fixed z-50 top-1/2 left-1/2 -translate-1/2 bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-xl font-semibold mb-4">Remove Account</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to remove {user?.email || "your account"}?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="destructive"
              onClick={handleRemoveSubmit}
              disabled={isLoading}>
              {isLoading ? "Removing..." : "Yes, Remove"}
            </Button>
            <Button
              variant="gray"
              onClick={handlePopup(false)}
              disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
}

export default RemoveAccount;
