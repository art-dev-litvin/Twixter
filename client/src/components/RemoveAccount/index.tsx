import React from "react";
import { useNavigate } from "react-router-dom";
import { removeAccount } from "../../services/api-requests/removeAccount";
import { toast } from "react-toastify";
import { routes } from "../../constants/routes";
import RemoveAccountPopup from "../RemoveAccountPopup";

function RemoveAccount() {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = React.useState(false);

  const handlePopup = (open: boolean) => () => {
    setOpenPopup(open);
  };

  const handleRemoveSubmit = async () => {
    const { result, error } = await removeAccount();

    if (error) {
      toast.error(error);
    }

    if (result) {
      toast.success("Account has been removed!");
      navigate(routes.home);
    }
  };

  return (
    <>
      <button
        onClick={handlePopup(true)}
        className="h-11 px-3 border rounded-md border-red-500 text-red-500 cursor-pointer hover:bg-red-50 transition-colors">
        Remove account
      </button>
      <RemoveAccountPopup
        open={openPopup}
        onClose={handlePopup(false)}
        onConfirm={handleRemoveSubmit}
      />
    </>
  );
}

export default RemoveAccount;
