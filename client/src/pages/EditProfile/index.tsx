import Card from "../../components/Card";
import EditUserForm from "../../components/EditUserForm";

function EditProfile() {
  return (
    <>
      <Card>
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <EditUserForm />
      </Card>
    </>
  );
}

export default EditProfile;
